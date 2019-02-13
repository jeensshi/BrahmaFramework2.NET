using System;
using System.Collections.Generic;
using System.Collections;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace JeensLab.StateMachine
{
    public class State:StateObject
    {
        public int id;
        public string name;
        public new string type = "State";
        public new bool gonext()
        {
            return true;
        }

    }
}
