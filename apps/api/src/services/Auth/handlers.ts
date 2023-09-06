import { APIGatewayEvent } from 'aws-lambda'

export async function foo(event: APIGatewayEvent) {
    console.log(event)
    return {
        bar: true
    }
}