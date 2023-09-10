import React, { useEffect } from "react";
import Input from "Components/Form/Input/Input";
import PhoneInput from "Components/Form/PhoneInput/PhoneInput";
import Label from "Components/Label/Label";
import BigLoading from "Components/Loading/BigLoading";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { showAlert } from "redux/alert/alert.thunk";
import { queryClient } from "services/http-client";
import {
  UseDeleteUsers,
  UseGetUsersById,
  UsePostUsers,
  UsePutUsers,
} from "services/user.service";
import WSelect from "Components/Form/WSelect/WSelect";

const userTypeOptions = [
  {
    label: "USER",
    value: "3110a62f-7774-442a-b9b3-2d762d3b791a",
  },
  {
    label: "ADMIN",
    value: "64b8d97f-5b9e-4ffc-bbaa-94038b6694be",
  },
];

const useMainSingleBase = () => {
  const { tab_name, id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const expanded = useSelector((state) => state.sidebar.expand);
  const expandedSinglePage = useSelector(
    (state) => state.sidebar.expandSinglePage
  );

  const { data, isLoading } = UseGetUsersById({
    id: id,
    querySettings: {
      enabled: id !== "create",
    },
  });

  const {
    control,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm({
    defaultValues: {},
  });

  useEffect(() => {
    if (id !== "create") {
      for (let item in data) {
        if (item !== "created_at" || item !== "updated_at")
          setValue(item, data[item]);
      }
      setValue("role_id", {
        label: data?.role_data?.name,
        value: data?.role_id,
      });
    }
  }, [data, setValue, id]);

  const { mutate: userMutate } = UsePostUsers({
    onSuccess: (res) => {
      dispatch(showAlert("Successfully created", "success"));
      navigate(`/main/${tab_name}`);
      reset();
      queryClient.refetchQueries("GET_USERS");
    },
    onError: (err) => {},
  });

  const { mutate: userUpdateMutate } = UsePutUsers({
    onSuccess: (res) => {
      dispatch(showAlert("Successfully Updated", "success"));
      navigate(`/main/${tab_name}`);
      reset();
      queryClient.refetchQueries("GET_USERS");
    },
    onError: (err) => {},
  });

  const onSubmit = (data) => {
    const apiData = {
      ...data,
      role_id: data.role_id.value,
      role_data: undefined,
    };
    if (id === "create") {
      userMutate(apiData);
    } else {
      userUpdateMutate({ id, apiData });
    }
  };

  const inputs = () => {
    if (isLoading) {
      return <BigLoading />;
    } else {
      switch (tab_name) {
        case "users":
          return (
            <>
              <Label label="First name*">
                <Input
                  control={control}
                  placeholder="Enter first name"
                  name="first_name"
                  validation={{
                    required: {
                      value: true,
                      message: "required",
                    },
                  }}
                  errors={errors}
                />
              </Label>
              <Label label="Last name*">
                <Input
                  control={control}
                  placeholder="Enter last name"
                  name="last_name"
                  validation={{
                    required: {
                      value: true,
                      message: "required",
                    },
                  }}
                  errors={errors}
                />
              </Label>
              <Label label="Ваш номер телефона*">
                <PhoneInput
                  mask="+\9\9\8 (99) 999-99-99"
                  maskChar="_"
                  name="phone_number"
                  control={control}
                  errors={errors}
                  validation={{
                    required: {
                      value: true,
                      message: "Обязательное поле",
                    },
                    validate: {
                      isFull: (value) => {
                        if (value.includes("_")) return "Invalid phone";
                      },
                    },
                  }}
                />
              </Label>
              <Label label="User name">
                <Input
                  control={control}
                  placeholder="Enter user name"
                  name="username"
                />
              </Label>
              <Label label="Password">
                <Input
                  control={control}
                  placeholder="Enter password"
                  name="password"
                  typePassword
                />
              </Label>
              <Label label="Role type">
                <WSelect
                  name="role_id"
                  control={control}
                  options={userTypeOptions}
                  defaultValue={{
                    label: "USER",
                    value: "3110a62f-7774-442a-b9b3-2d762d3b791a",
                  }}
                  errors={errors}
                  validation={{
                    required: {
                      value: true,
                      message: "Обязательное поле",
                    },
                  }}
                />
              </Label>
            </>
          );

        default:
          break;
      }
    }
  };

  const { mutate: userDeleteMutate } = UseDeleteUsers({
    onSuccess: (res) => {
      dispatch(showAlert("Successfully deleted", "success"));
      queryClient.refetchQueries("GET_USERS");
    },
    onError: (err) => {},
  });

  const handleDeleteSingle = () => {
    navigate(`/main/${tab_name}`);
    userDeleteMutate(id);
  };
  return {
    expanded,
    expandedSinglePage,
    tab_name,
    handleSubmit,
    onSubmit,
    control,
    errors,
    id,
    inputs,
    navigate,
    handleDeleteSingle,
  };
};

export default useMainSingleBase;
