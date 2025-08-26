import { useEffect, useState } from 'react'
// Later, wire FCM:
// import { getToken } from 'firebase/messaging'
// import { messaging } from './firebase'

export function useTopicState(topicId: string){
  const [subscribed, setSubscribed] = useState<boolean>(false)

  useEffect(() => {
    const s = localStorage.getItem(`topic:${topicId}`) === '1'
    setSubscribed(s)
  }, [topicId])

  async function toggle(){
    if (subscribed) {
      await unsubscribeTopic(topicId)
      setSubscribed(false)
    } else {
      await subscribeTopic(topicId)
      setSubscribed(true)
    }
  }
  return { subscribed, toggle }
}

export function TopicToggle({topic}:{topic:{id:string;label:string}}){
  const { subscribed, toggle } = useTopicState(topic.id)
  return (
    <div className="card" style={{flex:'1 1 280px'}}>
      <strong>{topic.label}</strong>
      <div style={{marginTop:8}}>
        <button className="btn" onClick={toggle}>
          {subscribed ? 'Disable' : 'Enable'}
        </button>
      </div>
      <div className="small" style={{marginTop:6}}>Topic: {topic.id}</div>
    </div>
  )
}

export async function subscribeTopic(topicId: string){
  localStorage.setItem(`topic:${topicId}`, '1')
  // Later: getToken(messaging, { vapidKey: import.meta.env.VITE_FIREBASE_MESSAGING_VAPID_KEY }) then call a CF endpoint
}

export async function unsubscribeTopic(topicId: string){
  localStorage.removeItem(`topic:${topicId}`)
}
