/* eslint-disable */
/* tslint:disable */
// @ts-nocheck
/*
 * ---------------------------------------------------------------
 * ## THIS FILE WAS GENERATED VIA SWAGGER-TYPESCRIPT-API        ##
 * ##                                                           ##
 * ## AUTHOR: acacode                                           ##
 * ## SOURCE: https://github.com/acacode/swagger-typescript-api ##
 * ---------------------------------------------------------------
 */

export enum Role {
  Admin = 0,
  User = 1,
}

export interface CategoryDto {
  /** @format int32 */
  categoryId?: number;
  categoryName?: string;
  categoryDescription?: string | null;
}

export interface ReceiptDto {
  /** @format int32 */
  dealId?: number;
  /** @format date-time */
  date?: string;
  /** @format int32 */
  listingId?: number;
  listingName?: string;
  /** @format decimal */
  pricePaid?: number;
  imageUrl?: string | null;
  /** @format int32 */
  sellerId?: number;
  sellerName?: string;
  /** @format int32 */
  buyerId?: number;
  buyerName?: string;
}

export interface ListingDto {
  /** @format int32 */
  listingId?: number;
  listingName?: string;
  listingDescription?: string | null;
  /** @format decimal */
  price?: number;
  imageUrl?: string | null;
  /** @format int32 */
  categoryId?: number;
  categoryName?: string;
  /** @format int32 */
  ownerId?: number;
  ownerName?: string;
}

export interface UserDto {
  /** @format int32 */
  userId?: number;
  userName?: string;
  avatarUrl?: string | null;
  role?: Role;
  isBanned?: boolean;
}

export type QueryParamsType = Record<string | number, any>;
export type ResponseFormat = keyof Omit<Body, "body" | "bodyUsed">;

export interface FullRequestParams extends Omit<RequestInit, "body"> {
  /** set parameter to `true` for call `securityWorker` for this request */
  secure?: boolean;
  /** request path */
  path: string;
  /** content type of request body */
  type?: ContentType;
  /** query params */
  query?: QueryParamsType;
  /** format of response (i.e. response.json() -> format: "json") */
  format?: ResponseFormat;
  /** request body */
  body?: unknown;
  /** base url */
  baseUrl?: string;
  /** request cancellation token */
  cancelToken?: CancelToken;
}

export type RequestParams = Omit<
  FullRequestParams,
  "body" | "method" | "query" | "path"
>;

export interface ApiConfig<SecurityDataType = unknown> {
  baseUrl?: string;
  baseApiParams?: Omit<RequestParams, "baseUrl" | "cancelToken" | "signal">;
  securityWorker?: (
    securityData: SecurityDataType | null,
  ) => Promise<RequestParams | void> | RequestParams | void;
  customFetch?: typeof fetch;
}

export interface HttpResponse<D extends unknown, E extends unknown = unknown>
  extends Response {
  data: D;
  error: E;
}

type CancelToken = Symbol | string | number;

export enum ContentType {
  Json = "application/json",
  JsonApi = "application/vnd.api+json",
  FormData = "multipart/form-data",
  UrlEncoded = "application/x-www-form-urlencoded",
  Text = "text/plain",
}

export class HttpClient<SecurityDataType = unknown> {
    public baseUrl: string = "https://server-bold-waterfall-8280.fly.dev";
  private securityData: SecurityDataType | null = null;
  private securityWorker?: ApiConfig<SecurityDataType>["securityWorker"];
  private abortControllers = new Map<CancelToken, AbortController>();
  private customFetch = (...fetchParams: Parameters<typeof fetch>) =>
    fetch(...fetchParams);

  private baseApiParams: RequestParams = {
    credentials: "same-origin",
    headers: {},
    redirect: "follow",
    referrerPolicy: "no-referrer",
  };

  constructor(apiConfig: ApiConfig<SecurityDataType> = {}) {
    Object.assign(this, apiConfig);
  }

  public setSecurityData = (data: SecurityDataType | null) => {
    this.securityData = data;
  };

  protected encodeQueryParam(key: string, value: any) {
    const encodedKey = encodeURIComponent(key);
    return `${encodedKey}=${encodeURIComponent(typeof value === "number" ? value : `${value}`)}`;
  }

  protected addQueryParam(query: QueryParamsType, key: string) {
    return this.encodeQueryParam(key, query[key]);
  }

  protected addArrayQueryParam(query: QueryParamsType, key: string) {
    const value = query[key];
    return value.map((v: any) => this.encodeQueryParam(key, v)).join("&");
  }

  protected toQueryString(rawQuery?: QueryParamsType): string {
    const query = rawQuery || {};
    const keys = Object.keys(query).filter(
      (key) => "undefined" !== typeof query[key],
    );
    return keys
      .map((key) =>
        Array.isArray(query[key])
          ? this.addArrayQueryParam(query, key)
          : this.addQueryParam(query, key),
      )
      .join("&");
  }

  protected addQueryParams(rawQuery?: QueryParamsType): string {
    const queryString = this.toQueryString(rawQuery);
    return queryString ? `?${queryString}` : "";
  }

  private contentFormatters: Record<ContentType, (input: any) => any> = {
    [ContentType.Json]: (input: any) =>
      input !== null && (typeof input === "object" || typeof input === "string")
        ? JSON.stringify(input)
        : input,
    [ContentType.JsonApi]: (input: any) =>
      input !== null && (typeof input === "object" || typeof input === "string")
        ? JSON.stringify(input)
        : input,
    [ContentType.Text]: (input: any) =>
      input !== null && typeof input !== "string"
        ? JSON.stringify(input)
        : input,
    [ContentType.FormData]: (input: any) => {
      if (input instanceof FormData) {
        return input;
      }

      return Object.keys(input || {}).reduce((formData, key) => {
        const property = input[key];
        formData.append(
          key,
          property instanceof Blob
            ? property
            : typeof property === "object" && property !== null
              ? JSON.stringify(property)
              : `${property}`,
        );
        return formData;
      }, new FormData());
    },
    [ContentType.UrlEncoded]: (input: any) => this.toQueryString(input),
  };

  protected mergeRequestParams(
    params1: RequestParams,
    params2?: RequestParams,
  ): RequestParams {
    return {
      ...this.baseApiParams,
      ...params1,
      ...(params2 || {}),
      headers: {
        ...(this.baseApiParams.headers || {}),
        ...(params1.headers || {}),
        ...((params2 && params2.headers) || {}),
      },
    };
  }

  protected createAbortSignal = (
    cancelToken: CancelToken,
  ): AbortSignal | undefined => {
    if (this.abortControllers.has(cancelToken)) {
      const abortController = this.abortControllers.get(cancelToken);
      if (abortController) {
        return abortController.signal;
      }
      return void 0;
    }

    const abortController = new AbortController();
    this.abortControllers.set(cancelToken, abortController);
    return abortController.signal;
  };

  public abortRequest = (cancelToken: CancelToken) => {
    const abortController = this.abortControllers.get(cancelToken);

    if (abortController) {
      abortController.abort();
      this.abortControllers.delete(cancelToken);
    }
  };

  public request = async <T = any, E = any>({
    body,
    secure,
    path,
    type,
    query,
    format,
    baseUrl,
    cancelToken,
    ...params
  }: FullRequestParams): Promise<HttpResponse<T, E>> => {
    const secureParams =
      ((typeof secure === "boolean" ? secure : this.baseApiParams.secure) &&
        this.securityWorker &&
        (await this.securityWorker(this.securityData))) ||
      {};
    const requestParams = this.mergeRequestParams(params, secureParams);
    const queryString = query && this.toQueryString(query);
    const payloadFormatter = this.contentFormatters[type || ContentType.Json];
    const responseFormat = format || requestParams.format;

    return this.customFetch(
      `${baseUrl || this.baseUrl || ""}${path}${queryString ? `?${queryString}` : ""}`,
      {
        ...requestParams,
        headers: {
          ...(requestParams.headers || {}),
          ...(type && type !== ContentType.FormData
            ? { "Content-Type": type }
            : {}),
        },
        signal:
          (cancelToken
            ? this.createAbortSignal(cancelToken)
            : requestParams.signal) || null,
        body:
          typeof body === "undefined" || body === null
            ? null
            : payloadFormatter(body),
      },
    ).then(async (response) => {
      const r = response as HttpResponse<T, E>;
      r.data = null as unknown as T;
      r.error = null as unknown as E;

      const responseToParse = responseFormat ? response.clone() : response;
      const data = !responseFormat
        ? r
        : await responseToParse[responseFormat]()
            .then((data) => {
              if (r.ok) {
                r.data = data;
              } else {
                r.error = data;
              }
              return r;
            })
            .catch((e) => {
              r.error = e;
              return r;
            });

      if (cancelToken) {
        this.abortControllers.delete(cancelToken);
      }

      if (!response.ok) throw data;
      return data;
    });
  };
}

/**
 * @title My Title
 * @version 1.0.0
 * @baseUrl http://localhost:5264
 */
export class Api<
  SecurityDataType extends unknown,
> extends HttpClient<SecurityDataType> {
  getCategories = {
    /**
     * No description
     *
     * @tags Category
     * @name CategoryGetCategories
     * @request GET:/GetCategories
     */
    categoryGetCategories: (params: RequestParams = {}) =>
      this.request<CategoryDto[], any>({
        path: `/GetCategories`,
        method: "GET",
        format: "json",
        ...params,
      }),
  };
  createCategory = {
    /**
     * No description
     *
     * @tags Category
     * @name CategoryCreateCategory
     * @request POST:/CreateCategory
     */
    categoryCreateCategory: (
      query?: {
        CategoryName?: string;
        CategoryDescription?: string | null;
      },
      params: RequestParams = {},
    ) =>
      this.request<CategoryDto, any>({
        path: `/CreateCategory`,
        method: "POST",
        query: query,
        format: "json",
        ...params,
      }),
  };
  updateCategory = {
    /**
     * No description
     *
     * @tags Category
     * @name CategoryUpdateCategory
     * @request PUT:/UpdateCategory
     */
    categoryUpdateCategory: (
      query?: {
        /** @format int32 */
        id?: number;
        CategoryName?: string;
        CategoryDescription?: string | null;
      },
      params: RequestParams = {},
    ) =>
      this.request<CategoryDto, any>({
        path: `/UpdateCategory`,
        method: "PUT",
        query: query,
        format: "json",
        ...params,
      }),
  };
  deleteCategory = {
    /**
     * No description
     *
     * @tags Category
     * @name CategoryDeleteCategory
     * @request DELETE:/DeleteCategory
     */
    categoryDeleteCategory: (
      query?: {
        /** @format int32 */
        id?: number;
      },
      params: RequestParams = {},
    ) =>
      this.request<void, any>({
        path: `/DeleteCategory`,
        method: "DELETE",
        query: query,
        ...params,
      }),
  };
  sellItem = {
    /**
     * No description
     *
     * @tags Deal
     * @name DealSellItem
     * @request POST:/SellItem
     */
    dealSellItem: (
      query?: {
        /** @format int32 */
        ListingId?: number;
        /** @format int32 */
        BuyerId?: number;
      },
      params: RequestParams = {},
    ) =>
      this.request<ReceiptDto, any>({
        path: `/SellItem`,
        method: "POST",
        query: query,
        format: "json",
        ...params,
      }),
  };
  getReceiptById = {
    /**
     * No description
     *
     * @tags Deal
     * @name DealGetReceiptById
     * @request GET:/GetReceiptById
     */
    dealGetReceiptById: (
      query?: {
        /** @format int32 */
        id?: number;
      },
      params: RequestParams = {},
    ) =>
      this.request<ReceiptDto, any>({
        path: `/GetReceiptById`,
        method: "GET",
        query: query,
        format: "json",
        ...params,
      }),
  };
  getReceiptsByUserId = {
    /**
     * No description
     *
     * @tags Deal
     * @name DealGetReceiptsByUserId
     * @request GET:/GetReceiptsByUserId
     */
    dealGetReceiptsByUserId: (
      query?: {
        /** @format int32 */
        id?: number;
      },
      params: RequestParams = {},
    ) =>
      this.request<ReceiptDto[], any>({
        path: `/GetReceiptsByUserId`,
        method: "GET",
        query: query,
        format: "json",
        ...params,
      }),
  };
  createListing = {
    /**
     * No description
     *
     * @tags Listing
     * @name ListingCreateListing
     * @request POST:/CreateListing
     */
    listingCreateListing: (
      query?: {
        ListingName?: string;
        ListingDescription?: string | null;
        /** @format decimal */
        Price?: number;
        ImageUrl?: string | null;
        /** @format int32 */
        CategoryId?: number;
        /** @format int32 */
        OwnerId?: number;
      },
      params: RequestParams = {},
    ) =>
      this.request<ListingDto, any>({
        path: `/CreateListing`,
        method: "POST",
        query: query,
        format: "json",
        ...params,
      }),
  };
  getAllListings = {
    /**
     * No description
     *
     * @tags Listing
     * @name ListingGetAllListings
     * @request GET:/GetAllListings
     */
    listingGetAllListings: (params: RequestParams = {}) =>
      this.request<ListingDto[], any>({
        path: `/GetAllListings`,
        method: "GET",
        format: "json",
        ...params,
      }),
  };
  getListingById = {
    /**
     * No description
     *
     * @tags Listing
     * @name ListingGetListingById
     * @request GET:/GetListingById
     */
    listingGetListingById: (
      query?: {
        /** @format int32 */
        id?: number;
      },
      params: RequestParams = {},
    ) =>
      this.request<ListingDto, any>({
        path: `/GetListingById`,
        method: "GET",
        query: query,
        format: "json",
        ...params,
      }),
  };
  getListingByUserId = {
    /**
     * No description
     *
     * @tags Listing
     * @name ListingGetListingByUserId
     * @request GET:/GetListingByUserId
     */
    listingGetListingByUserId: (
      query?: {
        /** @format int32 */
        id?: number;
      },
      params: RequestParams = {},
    ) =>
      this.request<ListingDto[], any>({
        path: `/GetListingByUserId`,
        method: "GET",
        query: query,
        format: "json",
        ...params,
      }),
  };
  updateListing = {
    /**
     * No description
     *
     * @tags Listing
     * @name ListingUpdateListing
     * @request PUT:/UpdateListing
     */
    listingUpdateListing: (
      query?: {
        /** @format int32 */
        id?: number;
        ListingName?: string;
        ListingDescription?: string | null;
        /** @format decimal */
        Price?: number;
        ImageUrl?: string | null;
        /** @format int32 */
        CategoryId?: number;
      },
      params: RequestParams = {},
    ) =>
      this.request<ListingDto, any>({
        path: `/UpdateListing`,
        method: "PUT",
        query: query,
        format: "json",
        ...params,
      }),
  };
  deleteListing = {
    /**
     * No description
     *
     * @tags Listing
     * @name ListingDeleteListing
     * @request DELETE:/DeleteListing
     */
    listingDeleteListing: (
      query?: {
        /** @format int32 */
        id?: number;
      },
      params: RequestParams = {},
    ) =>
      this.request<void, any>({
        path: `/DeleteListing`,
        method: "DELETE",
        query: query,
        ...params,
      }),
  };
  toggleActivateListing = {
    /**
     * No description
     *
     * @tags Listing
     * @name ListingToggleActivateListing
     * @request PUT:/ToggleActivateListing
     */
    listingToggleActivateListing: (
      query?: {
        /** @format int32 */
        id?: number;
      },
      params: RequestParams = {},
    ) =>
      this.request<ListingDto, any>({
        path: `/ToggleActivateListing`,
        method: "PUT",
        query: query,
        format: "json",
        ...params,
      }),
  };
  createUser = {
    /**
     * No description
     *
     * @tags User
     * @name UserCreateUser
     * @request POST:/CreateUser
     */
    userCreateUser: (
      query?: {
        UserName?: string;
        AvatarUrl?: string | null;
        Role?: Role;
      },
      params: RequestParams = {},
    ) =>
      this.request<UserDto, any>({
        path: `/CreateUser`,
        method: "POST",
        query: query,
        format: "json",
        ...params,
      }),
  };
  getUsers = {
    /**
     * No description
     *
     * @tags User
     * @name UserGetUsers
     * @request GET:/GetUsers
     */
    userGetUsers: (params: RequestParams = {}) =>
      this.request<UserDto[], any>({
        path: `/GetUsers`,
        method: "GET",
        format: "json",
        ...params,
      }),
  };
  getUserById = {
    /**
     * No description
     *
     * @tags User
     * @name UserGetUserById
     * @request GET:/GetUserById
     */
    userGetUserById: (
      query?: {
        /** @format int32 */
        userId?: number;
      },
      params: RequestParams = {},
    ) =>
      this.request<UserDto, any>({
        path: `/GetUserById`,
        method: "GET",
        query: query,
        format: "json",
        ...params,
      }),
  };
  updateUser = {
    /**
     * No description
     *
     * @tags User
     * @name UserUpdateUser
     * @request PUT:/UpdateUser
     */
    userUpdateUser: (
      query?: {
        /** @format int32 */
        id?: number;
        UserName?: string;
        AvatarUrl?: string | null;
        Role?: Role;
      },
      params: RequestParams = {},
    ) =>
      this.request<UserDto, any>({
        path: `/UpdateUser`,
        method: "PUT",
        query: query,
        format: "json",
        ...params,
      }),
  };
  deleteUser = {
    /**
     * No description
     *
     * @tags User
     * @name UserDeleteUser
     * @request DELETE:/DeleteUser
     */
    userDeleteUser: (
      query?: {
        /** @format int32 */
        userId?: number;
      },
      params: RequestParams = {},
    ) =>
      this.request<void, any>({
        path: `/DeleteUser`,
        method: "DELETE",
        query: query,
        ...params,
      }),
  };
  banUser = {
    /**
     * No description
     *
     * @tags User
     * @name UserBanUser
     * @request PUT:/BanUser
     */
    userBanUser: (
      query?: {
        /** @format int32 */
        userId?: number;
      },
      params: RequestParams = {},
    ) =>
      this.request<UserDto, any>({
        path: `/BanUser`,
        method: "PUT",
        query: query,
        format: "json",
        ...params,
      }),
  };
  login = {
    /**
     * No description
     *
     * @tags User
     * @name UserLogin
     * @request POST:/Login
     */
    userLogin: (
      query?: {
        Username?: string;
        SelectedRole?: Role;
      },
      params: RequestParams = {},
    ) =>
      this.request<UserDto, any>({
        path: `/Login`,
        method: "POST",
        query: query,
        format: "json",
        ...params,
      }),
  };
}
