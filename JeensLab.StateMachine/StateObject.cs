using System;
using System.Collections.Generic;
using System.Collections;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace JeensLab.StateMachine
{
    public class StateObject
    {
        public ArrayList nextobject = new ArrayList();
        public string type = "StateObject";
        public bool gonext()
        {
            return true;
        }

    }
}
