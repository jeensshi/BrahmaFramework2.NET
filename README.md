# BrahmaFramework2
easy to play like lego toys.

-------------------------------------------------------------------------
temporary goals:

add feature

1.link dynamic modules by reflection function

2.promote the sql-mapping analysis module by using new grammar analyzing

3.promote the variable definition in mapping.config.xml

4.sharing content like context, session could be easily used in every dynamic module.

5.AOP injection point could be easily insert into each module.

6.add statuscode definition list

7.one command return multiple datasets.

-------------------------------------------------------------------------
module definition fomat:

input: 	sharing context	(have some problems,such as how to chang variable value temporary instead of changing it permanently)

output :	

JToken datatype	(JSON object)

```
{
    'DataSet':[
        {
            'a':'',
            'b':''
        }
    ],
    'Struct':{
        'T_xxx':[
            'a',
            'b'
        ]
    },
    'Result':
    {
        'result':true,	//show you the result
       	'message':'',	//to mention
        'statuscode':'0x000001',	//let you know what happens
        //'errorcode':'0x000001',	discarded
        'text':'',	//to show
        'sql':'',	//show you the sql code
        'connectionstring':'',	//show you the database connection string
        'cdbsql':'',	//show you the current database sql code
        'cdbconnectionstring':''	//show you the current database connection string
    }
}
```

