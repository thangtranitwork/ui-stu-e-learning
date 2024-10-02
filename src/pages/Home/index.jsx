import React, { useEffect } from "react";
import Message from "../../components/Message";
export default function Home() {
  useEffect(() => {
    document.title = "STU E-Learning";
  }, []);
  return (
    <div>
      <Message
        message="testt"
        sender={{
          id: "dab209d4-2599-4860-b65d-22c945fb16d5",
          lastname: "Thùy này là ",
          firstname: "Thùy Ninh",
          avatar:
            "http://res.cloudinary.com/dw7hrsbba/image/upload/v1727171883/zcorwcu1kpc8qq1gpq0c.jpg",
          birthday: "2005-01-02",
          address: "Hoàng Hoa",
          bio: "Cảm ơn m.n đã yêu quý ạ",
          addFriendRequestSent: 0,
          lastOnline: "2119-10-23T19:43:37.710756",
          friend: false,
        }}
        own
      />
      <Message
        message="test cuc manh"
        sender={{
          id: "dab209d4-2599-4860-b65d-22c945fb16d5",
          lastname: "Thùy này là ",
          firstname: "Thùy Ninh",
          avatar:
            "http://res.cloudinary.com/dw7hrsbba/image/upload/v1727171883/zcorwcu1kpc8qq1gpq0c.jpg",
          birthday: "2005-01-02",
          address: "Hoàng Hoa",
          bio: "Cảm ơn m.n đã yêu quý ạ",
          addFriendRequestSent: 0,
          lastOnline: "2119-10-23T19:43:37.710756",
          friend: false,
        }}
      />
      <Message
        message={`<Message
        message="test cuc manh"
        sender={{
          id: "dab209d4-2599-4860-b65d-22c945fb16d5",
          lastname: "Thùy này là ",
          firstname: "Thùy Ninh",
          avatar:
            "http://res.cloudinary.com/dw7hrsbba/image/upload/v1727171883/zcorwcu1kpc8qq1gpq0c.jpg",
          birthday: "2005-01-02",
          address: "Hoàng Hoa",
          bio: "Cảm ơn m.n đã yêu quý ạ",
          addFriendRequestSent: 0,
          lastOnline: "2119-10-23T19:43:37.710756",
          friend: false,
        }}
        
      />`}
        sender={{
          id: "dab209d4-2599-4860-b65d-22c945fb16d5",
          lastname: "Thùy này là ",
          firstname: "Thùy Ninh",
          avatar:
            "http://res.cloudinary.com/dw7hrsbba/image/upload/v1727171883/zcorwcu1kpc8qq1gpq0c.jpg",
          birthday: "2005-01-02",
          address: "Hoàng Hoa",
          bio: "Cảm ơn m.n đã yêu quý ạ",
          addFriendRequestSent: 0,
          lastOnline: "2119-10-23T19:43:37.710756",
          friend: false,
        }}
      />
    </div>
  );
}
