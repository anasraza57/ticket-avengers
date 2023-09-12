

export namespace RestApi {

    type ErrorResponse = {
        message: string
        errorCode?: number
        details: string
    }

    type ListResponse<T> = {
        entities: Array<T>
        meta: {
            pageSize: number
            currentPage: number
            hasNextPage: boolean
        }
    }
}


export namespace RestApi.User {

    type LoginRequest = {
        email?: string
        phone?: string
        password: string
    }

    type LoginResponse = {
        userId: string
        expiresIn: number
    }

    type CreateRequest = {
        email: string
        phone: string
        password: string
        firstName: string
        lastName: string
    }

    type CreateReponse = {
        id: string
        email: string
        phone: string
        firstName: string
        lastName: string
        groups: string[]
        createdOn: string
        updatedOn: string
    }

    type UpdateRequest = Partial<CreateRequest>

    type UpdateResponse = CreateReponse

    type ReadResponse = {
        id: string
        email: string
        phone: string
        firstName: string
        lastName: string
        groups: string[]
        createdOn: string
        updatedOn: string
    }

    type ListResponse = RestApi.ListResponse<ReadResponse>
}