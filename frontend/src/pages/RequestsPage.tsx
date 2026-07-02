import { useState, useEffect } from 'react'
import RequestForm from '../components/RequestForm'
import RequestList from '../components/RequestList'
import { getAllRequests } from '../api'
import { RequestOut } from '../types'

function RequestsPage() {
  const [requests, setRequests] = useState<RequestOut[]>([])
  const [loading, setLoading] = useState(true)

  const fetchRequests = async () => {
    try {
      const data = await getAllRequests()
      setRequests(data)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchRequests()
  }, [])

  return (
    <div style={{ maxWidth: 900, margin: '0 auto', padding: 24 }}>
      <h1>Учёт заявок</h1>
      <RequestForm onCreated={fetchRequests} />
      {loading ? (
        <p>Загрузка...</p>
      ) : (
        <RequestList requests={requests} onDeleted={fetchRequests} />
      )}
    </div>
  )
}

export default RequestsPage
