using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.Web;
using Microsoft.AspNet.SignalR;

namespace BrahmaFramework
{
    public class DealDataHub : Hub
    {
        public void Send(string accountid,string groupName, string message)
        {
            // Call the broadcastMessage method to update clients.
            Clients.Group(groupName).broadcastMessage(accountid, message);
        }
        public Task JoinGroup(string groupName)
        {
            return Groups.Add(Context.ConnectionId, groupName);
        }

        public Task LeaveGroup(string groupName)
        {
            return Groups.Remove(Context.ConnectionId, groupName);
        }
        public void Hello()
        {
            Clients.All.hello();
        }
    }
}