import { useEffect, useState } from 'react'

export function useTopicState(topicId: string){
  const [subscribed, setSubscribed] = useState(false)
  useEffect(() => { setSubscribed(localStorage.getItem(`topic:${topicId}`) === '1') }, [topicId])
  async function toggle(){
    if (subscribed) await unsubscribeTopic(topicId)
    else await subscribeTopic(topicId)
    setSubscribed(!subscribed)
  }
  return { subscribed, toggle }
}

export async function subscribeTopic(topicId: string){
  localStorage.setItem(`topic:${topicId}`, '1')
  // later: FCM token + server call
}

export async function unsubscribeTopic(topicId: string){
  localStorage.removeItem(`topic:${topicId}`)
}
