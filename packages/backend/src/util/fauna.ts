import { values } from 'faunadb'

export function mapDocument<TDocument = any> (document: values.Document<TDocument>) {
  return {
    id: document.ref.id,
    ref: document.ref,
    ts: document.ts,
    ...document.data,
  }
}

export function mapDocuments<TDocument = any> (documents: Array<values.Document<TDocument>>) {
  return documents.map(mapDocument)
}
