// @ts-nocheck
import { Request } from 'express'

export default class HateoasLinks {
  constructor(baseUrl: string) {
    this.baseUrl = baseUrl
  }

  baseUrl: string

  createLink(req: Request, route: string): any {
    const links = {
      links: {
        self: {
          href: `${this.baseUrl}/${route}/${req._id}`,
          rel: 'self',
          method: 'GET'
        },
        update: {
          href: `${this.baseUrl}/${route}/${req._id}`,
          rel: 'self',
          method: 'PUT'
        },
        patch: {
          href: `${this.baseUrl}/${route}/${req._id}`,
          rel: 'self',
          method: 'PATCH'
        },
        delete: {
          href: `${this.baseUrl}/${route}/${req._id}`,
          rel: 'self',
          method: 'DELETE'
        }
      }
    }

    const hateoasResponse = {
      ...req._doc,
      ...links
    }

    return hateoasResponse
  }

  createCollectionResponse(pastries: any, route: string): string {
    //Itterate through the pastries and add the links to each one
    const hateoasResponse = pastries.map((pastry: any) => {
      const links = {
        links: {
          self: {
            href: `${this.baseUrl}/${route}/${pastry._id}`,
            rel: 'self',
            method: 'GET'
          },
          update: {
            href: `${this.baseUrl}/${route}/${pastry._id}`,
            rel: 'self',
            method: 'PUT'
          },
          patch: {
            href: `${this.baseUrl}/${route}/${pastry._id}`,
            rel: 'self',
            method: 'PATCH'
          },
          delete: {
            href: `${this.baseUrl}/${route}/${pastry._id}`,
            rel: 'self',
            method: 'DELETE'
          }
        }
      }
      return {
        ...pastry._doc,
        ...links
      }
    })

    return hateoasResponse
  }
}
