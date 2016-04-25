---

layout: post
title: Android页面的跳转及传值
description: Android页面的跳转及传值
keywords: android
category: android

---


## (1)使用Intent跳转页面

第一个activity:

	Intent myIntent = new Intent();    
	myIntent.putExtra("myText", myTextView.getText());
	myIntent.setClass(MainActivity.this, Activity2.class);
	startActivity(myIntent); 

第二个activity:


	//从MainActiviry中跳转到这个Activity中利用Intent传递数据。
	//获取Intent
	Intent intent = getIntent(); 
	String text  = intent.getStringExtra("myText");
	textview2 = (TextView)findViewById(R.id.textView1); 
	textview2.setText(text);

## (2)点击按钮或者链接，打开一个网站


	myBtn2.setOnClickListener(new OnClickListener(){
        @Override
        public void onClick(View v) {
            //访问网页。
            Uri uri = Uri.parse("http://www.baidu.com");
            Intent intent = new Intent(Intent.ACTION_VIEW,uri);
            startActivity(intent); 
        }
     });

## (3)使用Bundle传递参数

源Activity中：MainActivity.java

    BundleBtn.setOnClickListener(new OnClickListener(){
        @Override
        public void onClick(View v) {
            //使用Bundle传递参数
            Intent myIntent = new Intent();
            Bundle bundle = new Bundle();
            bundle.putString("info",myEditText.getText().toString());
            myIntent.putExtras(bundle);
            myIntent.setClass(MainActivity.this, Activity3Bundle.class);
            startActivity(myIntent);
        }
    });

目标Activity:Activity3Bundle.java

	public class Activity3Bundle extends Activity {
	    private TextView textView3;
	    @Override
	    protected void onCreate(Bundle savedInstanceState) {
	        super.onCreate(savedInstanceState);
	         setContentView(R.layout.activity3);
	
	        textView3 = (TextView)findViewById(R.id.textView3);
	        Bundle myBundle = this.getIntent().getExtras();
	        String myText  = myBundle.getString("info");
	        textView3.setText(myText);
	
	    }
	}

## (4)跳转后返回

使用Bundle传递参数，第一个Activity点击一个按钮，跳转到第二个页面。第二个页面输入一个内容，点击按钮，返回第一个Activity,并将第二个Activity中输入的内容显示在第一个Activity中。

第一个Activity代码：

	import android.app.Activity;
	import android.content.Intent;
	import android.os.Bundle;
	import android.view.Menu;
	import android.view.View;
	import android.view.View.OnClickListener;
	import android.widget.Button;
	import android.widget.EditText;
	import android.widget.TextView;
	
	public class MainActivity extends Activity {
	    private TextView myTextView;
	    private Button ZhuceBtn;
	    private final static int REQUESTCODE = 1;//返回的结果码
	
	    //Intent
	    private Intent MyIntent;
	
	    @Override
	    protected void onCreate(Bundle savedInstanceState) {
	        super.onCreate(savedInstanceState);
	        setContentView(R.layout.activity_main);
	         myTextView = (TextView)findViewById(R.id.textView1);
	        ZhuceBtn = (Button)findViewById(R.id.buttonzhuce);
	
	        //使用Intent向另一个Activity发送请求，使用Bundle返回参数
	        ZhuceBtn.setOnClickListener(new View.OnClickListener(){
	            @Override
	            public void onClick(View v) {
	                MyIntent = new Intent();
	                MyIntent.setClass(MainActivity.this, Activity3Bundle.class);
	                startActivityForResult(MyIntent,REQUESTCODE);
	            }
	        });
	
	
	    }
	
	    @Override
	    protected void onActivityResult(int requestCode,int resultCode,Intent data) {
	            // TODO Auto-generated method stub
	        super.onActivityResult(requestCode, resultCode, data);
	        if(requestCode==REQUESTCODE){
	            if(resultCode==2){
	                setTitle("Cancel****");
	            }else 
	                if(resultCode==1){
	//              String  Name=data.getStringExtra("username");
	                Bundle bundle = data.getExtras();
	                String Name = bundle.getString("username");
	                myTextView.setText("恭喜您，注册成功。您的用户名是："+Name);
	            }
	        }
	    }
	
	
	}


第二个Activity:


	public class Activity3Bundle extends Activity {
	    private Button zhuceBtn;
	    private EditText zhuceEdit;
	    private Button buttonCancle;//取消按钮
	
	    @Override
	    protected void onCreate(Bundle savedInstanceState) {
	        super.onCreate(savedInstanceState);
	        setContentView(R.layout.activity3);
	
	        zhuceEdit = (EditText)findViewById(R.id.editTextzhuce);
	        zhuceBtn = (Button)findViewById(R.id.buttonzhuce);
	        buttonCancle = (Button)findViewById(R.id.buttonCancle);
	
	        zhuceBtn.setOnClickListener(new View.OnClickListener(){
	
	            @Override
	            public void onClick(View v) {
	                //将参数传回请求的Activity
	                Intent zhuceIntent = new Intent();
	                Bundle myBundle = new Bundle();
	                myBundle.putString("username", zhuceEdit.getText().toString());
	                //zhuceIntent.putExtra("username", zhuceEdit.getText().toString());
	                zhuceIntent.putExtras(myBundle);
	                setResult(1,zhuceIntent);
	                finish();
	            }
	        });
	
	        buttonCancle.setOnClickListener(new View.OnClickListener(){
	
	            @Override
	            public void onClick(View v) {
	                //将参数传回请求的Activity
	                Intent zhuceIntent = new Intent();
	                setResult(2,zhuceIntent);
	                finish();
	            }
	        });
	    }
	}
	