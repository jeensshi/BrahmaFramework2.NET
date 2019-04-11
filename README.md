# BrahmaFramework2
easy to play like lego toys.

-------------------------------------------------------------------------
temporary goals:

add feature

1.link dynamic modules by reflection function(2019.4.9 finished).

2.promote the sql-mapping analysis module by using new grammar analyzing

3.promote the variable definition in mapping.config.xml

4.sharing content like context, session could be easily used in every dynamic module.

5.AOP injection point could be easily insert into each module.

6.add statuscode definition list

7.one command return multiple datasets.

8.sql injection defence(2019.4.11 added)

9.support single command request(2019.4.10 finshed)

10.pagination query(2019.4.9 finished)

11.menu module function and authentication(2019.4.8 finished)

12.response with dynamic json or other format(2019.4.11 added)

13.data request and response test page(2019.4.11 added)

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

