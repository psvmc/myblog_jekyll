---

layout: post
title: iOS 图片处理 生成文字图片
description: 用于用户没有设置图片时 根据名字生成图片
keywords: ios
categories: 
        - ios
        - image

---


### 工具类

```swift
import UIKit

///图片工具类
class ZJImageUtils{
    static var textBgColor:[String:UIColor] = [:];
    
    internal static func randomColor()-> UIColor{
        var color = ["#E1B154","#D2945B",
                     "#E57257","#38B1A2",
                     "#76A174","#5CA7C7","#B758A9",
                     "#F99A5A"
        ];
        let index = Int(arc4random_uniform(UInt32(color.count)));
        let hex = color[index];
        return UIColor(hexString: hex, alpha: 1.0)!;
    }
    
    ///文子转图片
    static func imageFromText(_ bgColor:UIColor,str:String,imageWidth:CGFloat)->UIImage{
        
        let size = CGSize(width: imageWidth, height: imageWidth);
        
        UIGraphicsBeginImageContextWithOptions(size, false, 0.0);
        let context:CGContext =  UIGraphicsGetCurrentContext()!;//获取画笔上下文
        
        context.setAllowsAntialiasing(true) //抗锯齿设置
        
        bgColor.set();
        
        UIRectFill(CGRect(x: 0, y: 0, width: size.width, height: size.height));
        
        let fontWidth = imageWidth/1.4/2;
        
        
        let y = (imageWidth - fontWidth*1.3)/2;
        //画字符串
        let font = UIFont.systemFont(ofSize: fontWidth);
        
        let attrs = [NSAttributedStringKey.font:font,NSAttributedStringKey.foregroundColor:UIColor.white];
        
        if(str.count>=2){
            let subStr:NSString = String(str.suffix(2)) as NSString;
            let x = (imageWidth - subStr.size(withAttributes: attrs).width)/2;
            subStr.draw(at: CGPoint(x: x, y: y), withAttributes:attrs);
        }else if(str.count==1){
            let x = (imageWidth - str.size(withAttributes: attrs).width)/2;
            str.draw(at: CGPoint(x: x, y: y), withAttributes:attrs);
        }else{
            
        }
        
        // 转成图片
        let image = UIGraphicsGetImageFromCurrentImageContext();
        UIGraphicsEndImageContext();
        
        return image!;
        
    }
    
    static func imageFromTextRandomBg(str:String,imageWidth:CGFloat)->UIImage{
        var bgColor:UIColor = randomColor();
        //设置背景色
        if(textBgColor[str] != nil){
            bgColor = textBgColor[str as String]!;
        }else{
            textBgColor[str] = bgColor;
        }
        return imageFromText(bgColor, str: str, imageWidth: imageWidth);
    }
    
    ///指定大小缩放
    static func imageZoomBySize(_ sourceImage:UIImage,newSize:CGSize)->UIImage{
        UIGraphicsBeginImageContext(newSize);
        sourceImage.draw(in: CGRect(x: 0, y: 0, width: newSize.width, height: newSize.height));
        let newImage = UIGraphicsGetImageFromCurrentImageContext();
        UIGraphicsEndImageContext();
        return newImage!;
    }
    
    ///等比例缩放,最大宽度,小图片不放大
    static func imageZoomByWidth(_ sourceImage:UIImage,maxWidth:CGFloat) -> UIImage{
        let imageSize = sourceImage.size;
        let width = imageSize.width;
        let height = imageSize.height;
        let targetWidth = (width >= maxWidth ? maxWidth : width);
        let targetHeight = (targetWidth / width) * height;
        if(targetWidth==width){
            return sourceImage;
        }else{
            return imageZoomBySize(sourceImage, newSize: CGSize(width: targetWidth, height: targetHeight))
        }
        
    }
    
    ///等比例缩放,最大高度,小图片不放大
    static func imageZoomByHeight(_ sourceImage:UIImage,maxHeight:CGFloat) -> UIImage{
        let imageSize = sourceImage.size;
        let width = imageSize.width;
        let height = imageSize.height;
        let targetHeight = (height >= maxHeight ? maxHeight : height);
        let targetWidth = (targetHeight / height) * width;
        if(targetHeight==height){
            return sourceImage;
        }else{
            return imageZoomBySize(sourceImage, newSize: CGSize(width: targetWidth, height: targetHeight))
        }
    }
    
    ///等比例缩放,最大高度,最大宽度,小图片不放大
    static func imageZoomByWidthHeight(_ sourceImage:UIImage,maxWidth:CGFloat,maxHeight:CGFloat) -> UIImage{
        let imageSize = sourceImage.size;
        let width = imageSize.width;
        let height = imageSize.height;
        
        if(width < maxWidth && height < maxHeight){
            return sourceImage;
        }else{
            let widthRatio = width / maxWidth;
            let heightRatio = height / maxHeight;
            let maxRatio = widthRatio > heightRatio ? widthRatio : heightRatio;
            let targetHeight = height / maxRatio;
            let targetWidth = width / maxRatio;
            
            return imageZoomBySize(sourceImage, newSize: CGSize(width: targetWidth, height: targetHeight))
        }
    }
    
    ///压缩JPG
    static func imageCompressJPG(_ sourceImage:UIImage)->Data{
        return UIImageJPEGRepresentation(sourceImage, 0.7)!;
    }
    
    ///压缩PNG
    static func imageCompressPng(_ sourceImage:UIImage)->Data{
        return UIImagePNGRepresentation(sourceImage)!;
    }
    
    ///图片模糊处理
    static func mohu(_ sourceImage:UIImage) -> UIImage{
        let context:CIContext = CIContext(options: nil);
        let inputImage = CIImage(image: sourceImage);
        
        // create gaussian blur filter
        
        let filter = CIFilter(name: "CIGaussianBlur")!;
        filter.setValue(inputImage, forKey: kCIInputImageKey);
        filter.setValue(NSNumber(value: 1.0 as Float), forKey: "inputRadius");
        
        // blur image
        
        let result:CIImage = filter.value(forKey: kCIOutputImageKey) as! CIImage;
        
        let cgImage:CGImage = context.createCGImage(result, from: result.extent)!;
        let image = UIImage(cgImage: cgImage);
        return image;
    }
    
    ///保存image为jpg文件
    static func saveJpg(_ sourceImage:UIImage) -> (Bool,String){
        let newImage = imageZoomByWidthHeight(sourceImage, maxWidth: 800, maxHeight: 800);
        let uuidStr = ZJStringUtils.getUUID();
        let documentsPath: AnyObject = NSSearchPathForDirectoriesInDomains(.documentDirectory,.userDomainMask,true)[0] as AnyObject
        let jpgPath = documentsPath.appending("/\(uuidStr).jpg");
        print(sourceImage)
        let result = (try? UIImageJPEGRepresentation(newImage, 0.7)!.write(to: URL(fileURLWithPath: jpgPath), options: [.atomic])) != nil;
        if(result){
            return (true,jpgPath);
        }else{
            return (false,jpgPath);
        }
    }
}
```

其中涉及的获取UUID的方法

```swift
///获取没有-的uuid字符串
static func getUUID() -> String{
   let uuidStr = UUID().uuidString;
   let uuidNewStr = replace(uuidStr, replaceStr: "-", withStr: "");
   return uuidNewStr;
}
```