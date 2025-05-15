   <div className="content"  onClick={() =>{ if(message.type_message=="file")handleFileDownload(message.message)}}>
                    {message.type_message=="file"?<p><span className='IoIosPaper'><IoIosPaper/></span> {message.message.slice(0, 10)}...</p>
                    :<p>{message.message}</p>}
                     <p id="time">{message.createdAt}</p>
                    {message.sender!=currentUser.id_user && <p id="name"><b>{message.username} {message.familyname}</b></p>}
                  </div> 