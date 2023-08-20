import { useRoutes, Navigate } from "react-router-dom";
// import About from "pages/About/About";
// import Blog from "pages/Blog/Blog";
import Products from "pages/Products/Products";
import ProductsById from "pages/ProductsById/ProductsById";
import NotFound from "pages/NotFound/NotFound";
import ProductsLayout from "./Layouts/ProductsLayout/ProductsLayout";
// import Protected from "helpers/Protected/Protected";
import MainLayout from "Layouts/MainLayout/MainLayout";
import Main from "pages/Main/Main";
import MainIndex from "pages/MainIndex/MainIndex";
import MainSingle from "pages/MainSingle/MainSingle";

export const Routes = () =>
  useRoutes([
    {
      path: "/",
      element: <Navigate to="/main" replace />,
    },
    {
      path: "/main",
      element: <MainLayout />,
      children: [
        { index: true, element: <MainIndex /> },
        {
          path: ":tab_name",
          element: <Main />,
          children: [
            {
              path: ":id",
              element: <MainSingle />,
            },
          ],
        },
      ],
    },
    // {
    //   path: "/about",
    //   element: (
    //     <Protected isProtected={true}>
    //       <About />
    //     </Protected>
    //   ),
    // },
    // {
    //   path: "/blog",
    //   element: <Blog />,
    // },
    // {
    //   path: "/products",
    //   element: <ProductsLayout />,
    //   children: [
    //     {
    //       index: true,
    //       element: <Products />,
    //     },
    //     {
    //       path: ":id",
    //       element: <ProductsById />,
    //     },
    //   ],
    // },
    {
      path: "*",
      element: <NotFound />,
    },
  ]);