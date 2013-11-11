fqueue
======

fqueue is a micro-plugin to queue function execution to handle asyncronous flow and stepping though functions.
  <ul>
    <li> It support adding or removing of function after initialization of queue.</li>
    <li>Support storing of data which can be used to all function whithin that queue</li>
    <li>Support parrallel and series async call.</li>
    <li>Give full control over queue like, stop , start (from any index), hold, continue, call next function.</li>
    <li>Can define ignore indexes if you are running queue again and don't want to run ignore some functions.</li>
    <li>Make your code more clean (especially if you are node - mongo developer it can save you from dirty callbacks)</li>
  </ul>
  <p>** fqueue passes queue object as this in all function but be sure to store this on some variable and use that inside any callback function, because there value of this will be different.</p>
  
  <p><strong>Installation</strong></p>
  <p>
  	For node 
    <pre>
npm install f-queue
	</pre>
    <br/>
    For browser just iclude fqueue.min.js file or fqueue.js in your directory.
  </p>
  <p><strong>Methods</strong></p>
  <table width="100%" border="0" cellspacing="0" cellpadding="10">
    <tr>
      <td width="27%">Methods</td>
      <td width="73%">Parameters</td>
      <td width="73%">Description</td>
    </tr>
    <tr>
      <td>next</td>
      <td>Any number of arguments which you want to pass on next function of queue.</td>
      <td>Execute the next method in queue.</td>
    </tr>
    <tr>
      <td>add</td>
      <td>1. function * : function you want to add<br>
      2. pos&nbsp;(optional) : Index at which function will be add. If not defined, add function on last.</td>
      <td>To add function on the queue&nbsp;after initialization.</td>
    </tr>
    <tr>
      <td>remove</td>
      <td>1. index * : Index of function which you want to remove.</td>
      <td>Remove a function at particular index from a queue.</td>
    </tr>
    <tr>
      <td>hold</td>
      <td>no parameter</td>
      <td>To hold the queue to go next item if autoStep option is enabled.</td>
    </tr>
    <tr>
      <td>continue</td>
      <td>no parameter</td>
      <td>Continue the queue to go to next item.</td>
    </tr>
    <tr>
      <td>complete</td>
      <td>Any number of arguments which you want to pass on next function of queue.</td>
      <td>To tell an async call have been finished</td>
    </tr>
    <tr>
      <td>start</td>
      <td><p>index * : Index at which you want to start the queue. <br>
        <br>
      Any arguments starting followed by first argument will be passed to to function through which queue is starting.</p></td>
      <td>To start the queue.</td>
    </tr>
    <tr>
      <td>stop</td>
      <td>no parameter</td>
      <td>To stop the queue.</td>
    </tr>
    <tr>
      <td>ignore</td>
      <td>idxAry :&nbsp; A array of indexes for which you don't want to execute your function.</td>
      <td>To define array of indexes to ignore.</td>
    </tr>
  </table>
  <p><br>
  <strong>Options</strong></p>
  <table width="100%" border="0" cellspacing="0" cellpadding="10">
    <tr>
      <td width="17%">Options</td>
      <td width="25%">Default</td>
      <td width="58%">Parameters</td>
    </tr>
    <tr>
      <td>autoStart</td>
      <td>true</td>
      <td>Auto start a queue.</td>
    </tr>
    <tr>
      <td>autoStep</td>
      <td>true</td>
      <td>Auto step to next function in a queue on finish of a function execution.</td>
    </tr>
    <tr>
      <td>startParams</td>
      <td>[] - empty array</td>
      <td>An array of parameters which you want to pass on first function.</td>
    </tr>
  </table>
  <p>You can change the defauls globally like<br>
  <pre><code>
    fqueue.defaults.autoStart=false;  
   </code></pre> 
  </p>
  <p><strong>Examples</strong></p>
  <p>Simple Example<br>
  <pre>
var queue=fqueue(
function(){
    //do somthing synchronous
    },
function(){
    //do somthing synchronous
    },
function(){
    //do somthing synchronous
    }		
);
  </pre>
  In this example queue will start during initialization and auto step through each function. If you don't want so you can disable those options like. 
  <pre>
var queue=fqueue({autoStart:false,autoStep:false}
function(){
    //do somthing synchronous
    },
function(){
    //do somthing synchronous
    },
function(){
    //do somthing synchronous
    }		
);
  </pre>
  <p>And then when you want you can start it using <em><strong>queue.start(index)</strong></em> and step through functions using <em><strong>queue.next()</strong></em>;
  </p>
  </p>
  <p>You can use <strong><em>.add()</em></strong> method to add function in queue after initializtion of queue or inside a function of queue.</p>
  <pre>
var queue=fqueue({autoStart:false}
function(){
    //do somthing synchronous
    },
function(){
    //do somthing synchronous
    //to get current index
    var index=this.current;
    //to add function next to current function
    this.add(function(){
            //do something else 
        },++index);
    },
function(){
    //do somthing synchronous
    }		
);

or
queue.add(function(){
    //do something else
});
  </pre>
  <p>Same you can use <em><strong>.remove()</strong></em> method.
  </p>
  <p>You can step to next method in middle of any function too.</p>
  <pre>
var queue=fqueue(
function(){
    //do somthing synchronous
    this.next();
    //do something else
    },
function(){
    //do somthing synchronous
    },
function(){
    //do somthing synchronous
    }		
);

  </pre>
  <p>** However if you are using .next() method when execution of the function completes it bypass all those function which are already been called by .next() method. </p>
  <p>To run asynchronous function you need two methods <strong><em>.hold()</em> </strong>and <em><strong>.complete()</strong></em> if autoStep is enabled or you want to run parrallel async functions, or you can use simply use next method to go next&nbsp;function in the queue after the complete of sync function.</p>

  <pre>
var queue=fqueue(
function(){
    queue.hold();
    $.get('get.php',function(){
            //do something
            //you can pass parameter to next function 
            queue.complete('Sudhanshu','23');
        });
    },
function(name,age){
    //do somthing synchronous
    },
function(){
    queue.hold();
    $.get('get.php',function(){
            //do something
            queue.complete();
        });
    }		
);

or

var queue=fqueue({autoStep:false}
function(){
    $.get('get.php',function(){
            //do something
            //you can pass parameter to next function 
            queue.next('Sudhanshu','23');
        });
    },
function(name,age){
    //do somthing synchronous
     queue.next();
    },
function(){
    //you can also use this instead of queue name, but be sure to save it on some variable
    // because "this" will change inside callback function.
    self=this;
    $.get('get.php',function(){
            //do something
            self.next();
        });
    }		
);
  </pre>
  <p>You can also run async functions in parrallel by sending those functions in a array.</p>
  <pre>
var queue=fqueue(
//send function in array to run them in parrallel
[function(){
    queue.hold();
    $.get('get.php',function(){
            //do something
            queue.complete();
        });
    },
function(){
    queue.hold();
    $.get('get.php',function(){
            //do something
            queue.complete();
        });
    }],
function(){
    //this will be executed after first two parrallel function's execution completes.
    //do somthing synchronous
    }		
);

  </pre>

You can use .data,.previousResult,.results to store data, get return value of previous function and to get result of all functions.
  <pre>
var queue=fqueue(
function(){
    //do somthing synchronous
    var name="Sudhanshu";
    this.data.name=name;
    return 1;
    },
function(){
    //do somthing synchronous
    console.log(this.data.name);
    //will log Sudhanshu
    return 2;
    },
function(){
    //do somthing synchronous
    console.log(this.previousResult);
    //will log 2;
    
    return 3;
    },
function(){
    //do something synchronous
    return 4;
}    
            
);

console.log(queue.results);
//will log [1,2,3,4];

  </pre>
 In some case you want to call the same queue but you want to ignore some functions in the queue. Suppose the first function was used only to get name and third function only log was done and while calling again the queue you want to ignore first and third function.
<pre>
queue.ignore([0,2]) //you have to give the index of function in a array which you want to ignore.
queue.start(0); //this will ignore the first and third function.
</pre>
