using Hr.Solution.Core.Constants;
using Hr.Solution.Core.Services.Interfaces;
using System;
using System.Collections.Generic;
using System.Drawing;
using System.IO;
using System.Linq;
using System.Text;
using System.Text.RegularExpressions;
using System.Threading.Tasks;

namespace Hr.Solution.Core.Services.Impl
{
    public class MediaServices : IMediaServices
    {

        public string ResizeImage(string imageBase64)
        {
            var base64Code = imageBase64.Split(',')[1];
            byte[] bytes = Convert.FromBase64String(base64Code);
            using (var ms = new MemoryStream(bytes))
            {
                var image = Image.FromStream(ms);

                var ratioX = (double)150 / image.Width;
                var ratioY = (double)150 / image.Height;
                var ratio = Math.Min(ratioX, ratioY);

                var width = (int)(image.Width * ratio);
                var height = (int)(image.Height * ratio);

                var newImage = new Bitmap(width, height);
                Graphics.FromImage(newImage).DrawImage(image, 0, 0, width, height);
                Bitmap bmp = new Bitmap(newImage);

                ImageConverter converter = new ImageConverter();

                bytes = (byte[])converter.ConvertTo(bmp, typeof(byte[]));
                return "data:image/*;base64," + Convert.ToBase64String(bytes);
            }
        }
    }
}
