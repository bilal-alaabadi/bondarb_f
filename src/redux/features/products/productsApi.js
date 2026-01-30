// src/redux/features/products/productsApi.js
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { getBaseUrl } from "../../../utils/baseURL";

const productsApi = createApi({
  reducerPath: "productsApi",
  baseQuery: fetchBaseQuery({
    baseUrl: `${getBaseUrl()}/api/products`,
    credentials: "include",
  }),
  tagTypes: ["Product", "ProductList"],
  endpoints: (builder) => ({
    fetchAllProducts: builder.query({
      query: (args = {}) => {
        const {
          category,
          minPrice,
          maxPrice,
          search,
          homeIndex,
          sort = "createdAt:desc",
          page = 1,
          limit = 10,
          lang = "en",
          size,
        } = args;

        const params = new URLSearchParams({
          page: String(page),
          limit: String(limit),
          sort,
          lang,
        });

        if (category && category !== "All") params.set("category", category);
        if (size) params.set("size", String(size));
        if (minPrice) params.set("minPrice", String(minPrice));
        if (maxPrice) params.set("maxPrice", String(maxPrice));
        if (search) params.set("search", String(search));
        if (homeIndex !== undefined && homeIndex !== null && homeIndex !== "")
          params.set("homeIndex", String(homeIndex));

        return `/?${params.toString()}`;
      },
      transformResponse: (response) => {
        const list = Array.isArray(response?.products) ? response.products : [];

        const normalized = list.map((p) => {
          const name = p?.name ?? p?.name_ar ?? p?.name_en ?? "";
          const description = p?.description ?? p?.description_ar ?? p?.description_en ?? "";
          const category = p?.category ?? p?.category_ar ?? p?.category_en ?? "";
          const image = Array.isArray(p?.image) ? p.image : p?.image ? [p.image] : [];
          const variants = Array.isArray(p?.variants) ? p.variants : [];

          return {
            ...p,
            name,
            description,
            category,
            image,
            variants,
            size: p?.size ?? "",
            homeIndex: p?.homeIndex ?? "",
            oldPrice: p?.oldPrice ?? "",
          };
        });

        return {
          products: normalized,
          totalPages: response?.totalPages ?? 1,
          totalProducts: response?.totalProducts ?? normalized.length,
        };
      },
      providesTags: (result) =>
        result
          ? [
              ...result.products.map(({ _id }) => ({ type: "Product", id: _id })),
              "ProductList",
            ]
          : ["ProductList"],
    }),

    fetchProductById: builder.query({
      query: (arg) => {
        let id;
        let lang = "en";
        if (typeof arg === "string" || typeof arg === "number") {
          id = arg;
        } else if (arg && typeof arg === "object") {
          id = arg.id;
          lang = arg.lang || "en";
        }
        return {
          url: `/product/${id}`,
          params: { lang },
        };
      },
      transformResponse: (response) => {
        const product = response?.product ?? response ?? {};

        const name = product?.name ?? product?.name_ar ?? product?.name_en ?? "";
        const description =
          product?.description ?? product?.description_ar ?? product?.description_en ?? "";
        const category =
          product?.category ?? product?.category_ar ?? product?.category_en ?? "";

        return {
          _id: product._id,
          name,
          category,
          size: product.size || "",
          price: product.price,
          oldPrice: product.oldPrice || "",
          description,
          image: Array.isArray(product.image) ? product.image : product.image ? [product.image] : [],
          variants: Array.isArray(product.variants) ? product.variants : [],
          author: product.author,
          homeIndex: product.homeIndex ?? "",

          name_en: product.name_en || "",
          name_ar: product.name_ar || "",
          description_en: product.description_en || "",
          description_ar: product.description_ar || "",
          category_en: product.category_en || "",
          category_ar: product.category_ar || "",

          reviews: Array.isArray(response?.reviews) ? response.reviews : [],
        };
      },
      providesTags: (result, error, arg) => {
        const id = typeof arg === "object" ? arg.id : arg;
        return [{ type: "Product", id }];
      },
    }),

    fetchRelatedProducts: builder.query({
      query: (arg) => {
        let id;
        let lang = "en";
        if (typeof arg === "string" || typeof arg === "number") {
          id = arg;
        } else if (arg && typeof arg === "object") {
          id = arg.id;
          lang = arg.lang || "en";
        }
        return {
          url: `/related/${id}`,
          params: { lang },
        };
      },
      transformResponse: (response) => {
        const list = Array.isArray(response)
          ? response
          : Array.isArray(response?.products)
          ? response.products
          : [];
        return list.map((p) => ({
          ...p,
          image: Array.isArray(p?.image) ? p.image : p?.image ? [p.image] : [],
          variants: Array.isArray(p?.variants) ? p.variants : [],
        }));
      },
      providesTags: (result, error, arg) => {
        const id = typeof arg === "object" ? arg.id : arg;
        return [{ type: "Product", id }, "ProductList"];
      },
    }),

    addProduct: builder.mutation({
      query: (newProduct) => ({
        url: "/create-product",
        method: "POST",
        body: newProduct,
      }),
      invalidatesTags: ["ProductList"],
    }),

    updateProduct: builder.mutation({
      query: ({ id, body }) => ({
        url: `/update-product/${id}`,
        method: "PATCH",
        body,
        credentials: "include",
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: "Product", id },
        "ProductList",
      ],
    }),

    deleteProduct: builder.mutation({
      query: (id) => ({
        url: `/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: (result, error, id) => [
        { type: "Product", id },
        "ProductList",
      ],
    }),

    searchProducts: builder.query({
      query: ({ q, lang = "en" }) =>
        `/search?q=${encodeURIComponent(q)}&lang=${encodeURIComponent(lang)}`,
      transformResponse: (response) => {
        const list = Array.isArray(response) ? response : [];
        return list.map((product) => ({
          ...product,
          image: Array.isArray(product?.image) ? product.image : product?.image ? [product.image] : [],
          variants: Array.isArray(product?.variants) ? product.variants : [],
        }));
      },
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ _id }) => ({ type: "Product", id: _id })),
              "ProductList",
            ]
          : ["ProductList"],
    }),

    fetchBestSellingProducts: builder.query({
      query: ({ limit = 4, lang = "en" } = {}) =>
        `/best-selling?limit=${encodeURIComponent(limit)}&lang=${encodeURIComponent(lang)}`,
      transformResponse: (response) => {
        const list = Array.isArray(response)
          ? response
          : Array.isArray(response?.products)
          ? response.products
          : [];
        return list.map((p) => ({
          ...p,
          image: Array.isArray(p?.image) ? p.image : p?.image ? [p.image] : [],
          variants: Array.isArray(p?.variants) ? p.variants : [],
        }));
      },
      providesTags: ["ProductList"],
    }),
  }),
});

export const {
  useFetchAllProductsQuery,
  useLazyFetchAllProductsQuery,
  useFetchProductByIdQuery,
  useLazyFetchProductByIdQuery,
  useAddProductMutation,
  useUpdateProductMutation,
  useDeleteProductMutation,
  useFetchRelatedProductsQuery,
  useSearchProductsQuery,
  useLazySearchProductsQuery,
  useFetchBestSellingProductsQuery,
} = productsApi;

export default productsApi;
