import os
import string
import random

from StringIO import StringIO
from PIL import Image

from newebe.config import CONFIG


class Resizer(object):
    '''
    Utilities to modifiy image files
    '''

    def resize(self, image_file, width, height):
        '''
        Resize given image. Returns a PIL Image object.
        '''
        image = Image.open(StringIO(image_file))
        image = image.resize((width, height))
        return image

    def resize_and_get_file(self, image_file, width, height):
        '''
        Resize given image file. Returns a file buffer.
        '''
        image = self.resize(image_file, width, height)
        return self.get_file_buffer_from_image(image)

    def get_file_buffer_from_image(self, image):
        '''
        Convert a PIL image to a file buffer
        '''
        chars=string.ascii_uppercase + string.digits
        filename = ''.join(random.choice(chars) for x in range(20)) + ".jpg"
        filepath = os.path.join(CONFIG.main.path, filename)
        image.save(filepath)
        filebuffer = open(filepath)
        os.remove(filepath)

        return filebuffer
