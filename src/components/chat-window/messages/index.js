import React, { useCallback, useEffect, useState } from 'react'
import { useParams } from 'react-router'
import { Alert } from 'rsuite'
import { auth, database } from '../../../misc/firebase'
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

  const handleLike = useCallback( async(msgId) => {
    const { uid } = auth.currentUser
    const MessageRef = database.ref(`/messages/${msgId}`)

    let AlertMsg
    
    await MessageRef.transaction( msg => {
      if (msg) {
        if (msg.likes && msg.likes[uid]) {
          msg.likeCount-=1
          msg.likes[uid] = null
          AlertMsg = 'Like removed'
        } else {
          msg.likeCount+=1

          if(!msg.likes) {
            msg.likes={}
          }

          msg.likes[uid] = true
          AlertMsg = 'Like added'
        }
      }
      return msg;
    })

    Alert.info(AlertMsg,4000)

  },[])

  const handleDelete = useCallback ( async(msgId) => {
      
    // eslint-disable-next-line no-alert
    if(!window.confirm('Delete this message??')) {
      return
    }

    const isLast = messages[messages.length-1].id === msgId
    
    const updates = {}
    
    updates[`/messages/${msgId}`] = null

    if(isLast && messages.length>1) {
      updates[`/rooms/${chatId}/lastMessage`] = {
        ...messages[messages.length-2],
        MsgId: messages[messages.length-2].id
      }
    }

    if(isLast && messages.length === 1)
      updates[`/rooms/${chatId}/lastMessage`] = null

    try {
      await database.ref().update(updates)
      Alert.info('Message has been deleted',4000)
    } catch (err) {
      Alert.error(err.message,4000)
    }
    
    },[chatId,messages])

  
  return (
    <ul className="msg-list custom-scroll">
      
      {isChatEmpty && <li>No Messages yet</li>}
      {canShowMessages && 
        messages.map(msg => 
          <MessageItem 
            key={msg.id} 
            message={msg} 
            handleAdmin={handleAdmin} 
            handleLike={handleLike} 
            handleDelete={handleDelete}
          />
      )}
    </ul>
  )
}

export default Messages
