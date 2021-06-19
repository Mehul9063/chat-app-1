import React, { useCallback, useEffect, useState } from 'react'
import { useParams } from 'react-router'
import { Alert } from 'rsuite'
import { database } from '../../../misc/firebase'
import { transformToArrWithId } from '../../../misc/helpers'
import MessageItem from './MessageItem'

const Messages = () => {
  
  const { chatId } = useParams()
  const [messages,setMessages] = useState(null)

  const isChatEmpty = messages && messages.length === 0
  const canShowMessages = messages && messages.length > 0

  useEffect(() => {
    const messagesRef = database.ref('/messages')
    messagesRef
      .orderByChild('roomId')
      .equalTo(chatId)
      .on('value',(snap) => {

      const data = transformToArrWithId(snap.val())

      setMessages(data)

    })

    return () => {
      messagesRef.off('value')
    }

  },[chatId])

  const handleAdmin = useCallback( async(uid) => {

    const AdminsRef = database.ref(`/rooms/${chatId}/admins`)

    let AlertMsg
    
    await AdminsRef.transaction( admins => {
      if (admins) {
        if (admins[uid]) {
          admins[uid] = null
          AlertMsg = 'Admin Permission Removed'
        } else {
          admins[uid] = true
          AlertMsg = 'Admin Permission Granted'
        }
      }
      return admins;
    })

    Alert.info(AlertMsg,4000)

  },[chatId])
  
  return (
    <ul className="msg-list custom-scroll">
      
      {isChatEmpty && <li>No Messages yet</li>}
      {canShowMessages && messages.map(msg => <MessageItem key={msg.id} message={msg} handleAdmin={handleAdmin}/>)}

    </ul>
  )
}

export default Messages
