PVRTexToolCL version 4.20
SDK Version: 18.1@5086772
PVRTexLib 4.20 | JpegLib version 8` | LibPNG version 1.5.12

Valid arguments:
-i [filepath],<additionalfiles...>
-o <filepath>
-d <filepath>
-cube <faceorder>
-array 
-pad [2|4|8]
-legacypvr 
-r [width],[height]
-square <+|->
-pot <+|->
-rfilter [nearest|linear|cubic]
-rotate [z],<+|->
-flip [x|y],<"flag">
-b <width>,<height>
-p 
-l 
-n [scale],<channelorder>
-m <numberofmipmaps>
-mfilter ['nearest'|'linear'|'cubic']
-c 
-f [format],<variabletype>,<colourspace>
-q ['pvrtcfastest'|'pvrtcfast'|'pvrtcnormal'|'pvrtchigh'|'pvrtcbest'|'etcfast'|'etcslow'|'etcfastperceptual'|'etcslowperceptual'|'astcveryfast'|'astcfast'|'astcmedium'|'astcthorough'|'astcexhaustive']
-dither 
-shh 
-help <commandargument>
-red [filename],<channelname>
-green [filename],<channelname>
-blue [filename],<channelname>
-alpha [filename],<channelname>
-diff [filename],<mode>,<modifier>
-rcanvas [width],[height]
-squarecanvas <+|->
-potcanvas <+|->
-offsetcanvas [xoffset],[yoffset]
-centrecanvas 


Input File: 
REQUIRED
Set the input file or files. Must be a JPEG, PNG, BMP, PVR, KTX, DDS or ASTC file. If either the cube map or texture array flag is set, multiple files should be explicitly specified.
Usage
	-i [filepath],<additionalfiles...>
Example
	-i picture.jpg, otherpicture.png

Output File: 
Set the output file destination. If specified, must be a PVR, H, KTX or DDS file. Otherwise will output a file with the same name as the first input file. If the input file was also a .pvr file, the name will have ".Out" inserted before the file extension. 
Usage
	-o <filepath>
Example
	-o texture.pvr

Decompress Output: 
Whether or not to save a decompressed file alongside the input. A filename can be specified which must be a JPEG, PNG or BMP. Otherwise will decompress to a file with the same name as the first input file, but with '.Out' inserted between the name and the extension. For cubemaps and texture arrays, behaviour is special - a series of files are output in the following format: <Name>.Face<FaceNumber>.Array<ArrayNumber>.<Extension> - e.g. Texture.Out.Face1.Array12.png
Usage
	-d <filepath>
Example
	-d decompressed.png

Cube Map: 
Will construct a cube map from available input files. If present, the input file argument must contain at least 6 textures, or a multiple of 6 textures if the array flag is present. Textures of different sizes will all be resized with a linear filter into the size of the original texture, or the specified size if resizing.
Usage
	-cube <faceorder>
Example
	-cube +X,-X,+Y,-Y,+Z,-Z

Texture Array: 
Will construct a texture array from available input files. If present, the input file argument should contain multiple files, or a multiple of 6 textures if the cube map flag is present.
Usage
	-array 
Example
	-array 

Pad Meta Data: 
Will add padding to the meta data, so that the texture data sits on a 2,4 or 8 byte boundary, according to the parameter specified. Must have a parameter in the form of an integer, valid values are 2,4 or 8.
Usage
	-pad [2|4|8]
Example
	-pad 4

Legacy PVR: DEPRECATED 
Will force the output file to be saved out as a legacy PVR file (PVR v2) for backwards compatibility purposes.
Usage
	-legacypvr 
Example
	-legacypvr 

Resize: 
Resizes a texture to the given size. Accepts two unsigned integer parameters - width and height. Values up to 8192x8192 are supported. Option is incompatible with Square or Power of Two resize options.
Usage
	-r [width],[height]
Example
	-r 512,256

Resize Square: 
Forces the texture into a square. A single character parameter, '-' or '+', can be specified to specify whether it is resized smaller(-) or larger(+). Incompatible with standard resize.
Usage
	-square <+|->
Example
	-square +

Resize Power of Two: 
Forces the texture into power of two dimensions. A single character parameter, '-' or '+', can be specified to specify whether it is resized smaller(-) or larger(+). Incompatible with standard resize.
Usage
	-pot <+|->
Example
	-pot +

Resize Filter: 
By default, a linear filter is used to resize textures. Setting this flag to 'nearest','linear' or 'cubic' will force it to use the specified filter instead.Usage
	-rfilter [nearest|linear|cubic]
Example
	-rfilter cubic

Rotate: 
Rotate the texture around a given axis 'x','y' or 'z'. Currently only 'z' is supported - this is a standard 2D rotate. Also requires a second argument '-' or '+' to choose the rotate direction. In the context of a 2D rotation, + is clockwise, - is anti-clockwise.
Usage
	-rotate [z],<+|->
Example
	-rotate z,+

Flip: 
Flips the texture over a given axis 'x', 'y', or 'z'. Currently only 'x' and 'y' are supported providing a standard 2D flip. Also accepts an optional second argument, "flag", that adds meta-data to the texture marking it as being flipped.  This is useful when knowledge of the orientation is required ahead of time.  For example, displaying a flipped texture in its original orientation.
Usage
	-flip [x|y],<"flag">
Example
	-flip y,flag

Add Border: 
Adds a mirrored border to the texture. If no arguments are specified, PVRTexTool will choose an appropriate border size for the texture. Alternative, border sizes can be chosen manually for the width and height. Specifying just the width is allowed, and will result in the vertical border having a height of 0.
Usage
	-b <width>,<height>
Example
	-b 4,4

Pre-Multiply Alpha: 
Pre-Multiplies the texture by its alpha value.
Usage
	-p 
Example
	-p 

Alpha Bleed: 
Discards any data in fully transparent areas to optimise the texture for better compression.
Usage
	-l 
Example
	-l 

Normal Map Generation: 
Using the input texture as a height map (by creating an intensity texture from the r,g and b channels), will generate a normal map. Accepts two arguments: A positive float which determines the scale that the height map is assumed to be on, and a string of a combination of the four characters 'x','y','z' and 'h'. These specify the channel order as saved out into the texture. x,y and z specify these components, and h specifies the original height value used. Duplicate channels are not allowed, but channels can be missed off. This argument is optional, and will default to 'xyz'.
Usage
	-n [scale],<channelorder>
Example
	-n 1.0,xyzh

MIP-Map Generation: 
Generates MIP-Maps for the current texture. An optional unsigned integer can be added to specify the number of MIP Map levels which should be generated, otherwise a full chain are created.
Usage
	-m <numberofmipmaps>
Example
	-m 9

MIP-Map Filter: 
By default, a linear filter is used to generate MIP-Maps. Setting this flag to 'nearest','linear' or 'cubic' will force it to use the specified filter instead.
Usage
	-mfilter ['nearest'|'linear'|'cubic']
Example
	-mfilter cubic

Colour MIP-Maps: 
Saturates the tail of the MIP-Map chain with colours for debugging purposes - if you never see the original colour of a texture, then you know it's using MIP-Maps at all times and some upper levels can be removed from the texture to reduce memory consumption.
Usage
	-c 
Example
	-c 

Encode Format: 
REQUIRED
Sets the format to encode to. 
First argument (required) is the format, which can be either a compressed format (see Usage for a list) or a non-compressed format in the form 'r8g8b8a8'. Any number of channels up to 4 can be specified, but must be matched with a size (in bits) at all times. Valid channel names are 'r','g','b','a','i','l' or 'x'. Valid sizes range from 1 to 32, but the total of all sizes must be a multiple of 8 (byte aligned).
The second argument is the channel type. This is optional - defaults to Normalised Unsigned Byte. Specifying a type is generally not required for compressed formats, but generally is for uncompressed formats. See usage table for valid values. 
The third and final argument specifies the colour space, which will accept either sRGB or lRGB - default is lRGB for linear rgb.
Usage
	-f [format],<variabletype>,<colourspace>
Example
	-f PVRTC1_2,UBN,lRGB 

-Valid Formats: PVRTC1_2, PVRTC1_4, PVRTC1_2_RGB, PVRTC1_4_RGB, PVRTC2_2, PVRTC2_4, ETC1, BC1, BC2, BC3,UYVY, YUY2, 1BPP, RGBE9995, RGBG8888, GRGB8888, ETC2_RGB, ETC2_RGBA, ETC2_RGB_A1, EAC_R11, EAC_RG11, ASTC_4x4, ASTC_5x4, ASTC_5x5, ASTC_6x5, ASTC_6x6, ASTC_8x5, ASTC_8x6, ASTC_8x8, ASTC_10x5, ASTC_10x6, ASTC_10x8, ASTC_10x10, ASTC_12x10, ASTC_12x12, ASTC_3x3x3, ASTC_4x3x3, ASTC_4x4x3, ASTC_4x4x4, ASTC_5x4x4, ASTC_5x5x4, ASTC_5x5x5, ASTC_6x5x5, ASTC_6x6x5, ASTC_6x6x6

-Valid Variable Types: UB, UBN, SB, SBN, US, USN, SS, SSN, UI, UIN, SI, SIN, UF, SF. 

 - Key: 
 - First Char- S=Signed, U=Unsigned. 
 - Second Char- B=Byte, S=Short, I=Integer, F=Float. 
 - Third Character (optional) N=Normalised.
-Valid Colourspaces: lRGB, sRGB.

Encode Quality: 
Sets the quality level to compress with. See usage table for valid options. Only currently useful with PVRTC, ETC and ASTC formats.
Usage
	-q ['pvrtcfastest'|'pvrtcfast'|'pvrtcnormal'|'pvrtchigh'|'pvrtcbest'|'etcfast'|'etcslow'|'etcfastperceptual'|'etcslowperceptual'|'astcveryfast'|'astcfast'|'astcmedium'|'astcthorough'|'astcexhaustive']
Example
	-q pvrtcfast

Dither: 
Tells the compressor to dither the texture before compression to avoid banding artifacts.
Usage
	-dither 
Example
	-dither 

Silence: 
Tells the utility to not output messages of any kind.
Usage
	-shh 
Example
	-shh 

Help: 
Requests help with either a list of all commands or for help on a specified argument, if the argument name is listed as a parameter.
Usage
	-help <commandargument>
Example
	-help "flip"

Red Channel: 
Sets the Red channel in the input texture to match the channel specified in a second image. A filename is specified for the source, and an optional channel name (single character) can be specified to select the source. By default, the channel will draw from its equivalent in the new texture. E.g. Red will draw from red, green from green etc. Valid source channels are 'r','g','b','a','l','i'. These represent red, green, blue, alpha, luminance and intensity.
Usage
	-red [filename],<channelname>
Example
	-red Red.png,g

Green Channel: 
Sets the Green channel in the input texture to match the channel specified in a second image. A filename is specified for the source, and an optional channel name (single character) can be specified to select the source. By default, the channel will draw from its equivalent in the new texture. E.g. Red will draw from red, green from green etc. Valid source channels are 'r','g','b','a','l','i'. These represent red, green, blue, alpha, luminance and intensity.
Usage
	-green [filename],<channelname>
Example
	-green Green.dds,b

Blue Channel: 
Sets the Blue channel in the input texture to match the channel specified in a second image. A filename is specified for the source, and an optional channel name (single character) can be specified to select the source. By default, the channel will draw from its equivalent in the new texture. E.g. Red will draw from red, green from green etc. Valid source channels are 'r','g','b','a','l','i'. These represent red, green, blue, alpha, luminance and intensity.
Usage
	-blue [filename],<channelname>
Example
	-blue Blue.pvr,r

Alpha Channel: 
Sets the Alpha channel in the input texture to match the channel specified in a second image. A filename is specified for the source, and an optional channel name (single character) can be specified to select the source. By default, the channel will draw from its equivalent in the new texture. E.g. Red will draw from red, green from green etc. Valid source channels are 'r','g','b','a','l','i'. These represent red, green, blue, alpha, luminance and intensity.
Usage
	-alpha [filename],<channelname>
Example
	-alpha Alpha.bmp,i

Difference: 
Calculates the difference between the input and a supplied file, providing error metrics, and is incompatible with performing compression (-f). A visual representation of the differences can be output by selecting an output mode;
 - 'Colour' Outputs the absolute delta of each channel into a texture.
   The modifier multiplies the deltas to highlight any issues (Default: 1.0)
 - 'Tolerance' will diff using the modifier as threshold (Default: 0.1):
   Deltas of 0 are black, above the threshold are red, below are blue.
 - 'Blend' will blend the images using the modifier
   as a weighting of the first texture against the second. (Default: 0.5)
 - 'None' (Default) will supress any output, so that it only provides metrics.
Usage
	-diff [filename],<mode>,<modifier>
Example
	-diff Other.png,Tolerance,0.5f

Resize Canvas: 
Resizes a texture to the given size, without changing the image data. This takes effect after resizing. Accepts two unsigned integer parameters - width and height. Values up to 8192x8192 are supported. Option is incompatible with Square or Power of Two canvas resize options.
Usage
	-rcanvas [width],[height]
Example
	-rcanvas 512,256

Resize Canvas Square: 
Forces the texture into a square, without changing the image data. This takes effect after resizing. A single character parameter, '-' or '+', can be specified to specify whether it is resized smaller(-) or larger(+). Incompatible with standard resize.
Usage
	-squarecanvas <+|->
Example
	-squarecanvas +

Resize Canvas Power of Two: 
Forces the texture into power of two dimensions, without changing the image data. This takes effect after resizing. A single character parameter, '-' or '+', can be specified to specify whether it is resized smaller(-) or larger(+). Incompatible with standard resize.
Usage
	-potcanvas <+|->
Example
	-potcanvas +

Offset Canvas: 
Sets the offset when performing a canvas resize (including square or pot resizes). Accepts two signed integer parameters - xoffset and yoffset. Values from -8192x-8192 to 8192x8192 are supported. Incompatible with canvas centring. 
Usage
	-offsetcanvas [xoffset],[yoffset]
Example
	-offsetcanvas -12,56

Offset Canvas: 
Sets the offset when performing a canvas resize (including square or pot resizes) so that the image resides in the centre of the canvas. Incompatible with canvas offset. 
Usage
	-centrecanvas 
Example
	-centrecanvas 

