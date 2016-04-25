---

layout: post
title: spring注入 属性编辑器
description: 自定义属性编辑器
keywords: springmvc
category: springmvc

---

## 作用

表单提交过来的所有字段都是`字符串`类型的，之所以vo对象中的`Integer`等类型能被注入是因为`springmvc`已经默认定义了许多`属性编辑器`来进行处理，但是你传过来一个`2014-01-01 16:10` 他就不会处理了
所以写一个自定义编辑器就能解决了

## 使用方式

### 添加自定义属性编辑器

	@InitBinder
	public void initBinder(WebDataBinder binder) {
	    binder.registerCustomEditor(Date.class, new PropertyEditorSupport() {
	        @Override
	        public String getAsText() {
	            return ZJ_DateUtils.date2datetimeStr((Date) getValue());
	        }
	        @Override
	        public void setAsText(String text) {
	            setValue(ZJ_DateUtils.str2date(text));
	        }
	    });
	}

### 时间转换工具类

	public class ZJ_DateUtils {
	    private static String DateTime_Format_Str = "yyyy-MM-dd HH:mm:ss";
	    private static String Time_Format_Str = "HH:mm:ss";
	    private static String Hour_Minute_Format_Str = "HH:mm";
	    private static SimpleDateFormat dateFormat = new SimpleDateFormat("yyyy-MM-dd");
	    private static SimpleDateFormat timeFormat = new SimpleDateFormat("HH:mm:ss");
	    private static SimpleDateFormat dateTimeFormat = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
	    // 日期字符串转Date
	    public static Date str2date(String dateStr) {
	        if (null == dateStr || "".equals(dateStr)) {
	            return null;
	        }
	        dateStr = dateStr.replaceAll("-", " ").replaceAll(":", " ").replaceAll("[.]", " ");
	        String newTimeStr = "";
	        String[] dateStrArray = dateStr.split(" ");
	        int[] timeArray = { 1, 1, 1, 0, 0, 0 };
	        for (int i = 0; i < dateStrArray.length; i++) {
	            if (i < 6) {
	                timeArray[i] = Integer.valueOf(dateStrArray[i]);
	            }
	        }
	        newTimeStr = String.format("%s-%s-%s %s:%s:%s", timeArray[0], timeArray[1], timeArray[2], timeArray[3], timeArray[4], timeArray[5]);
	        SimpleDateFormat sdf = new SimpleDateFormat(DateTime_Format_Str);
	        Date d = null;
	        try {
	            d = sdf.parse(newTimeStr);
	        } catch (ParseException e) {
	            e.printStackTrace();
	        }
	        return d;
	    }
	    // Date转字符串
	    public static String date2datetimeStr(Date date) {
	        return new SimpleDateFormat(DateTime_Format_Str).format(date);
	    }
	｝