from __future__ import absolute_import
import datetime
from flask import current_app
#from google.cloud import storage
import six
from werkzeug.utils import secure_filename
from werkzeug.exceptions import BadRequest
import os
from urllib.parse import quote
def _get_storage_client():
    """
    storage.Client( project=current_app.config['PROJECT_ID'])
    """
    return None

def _check_extension(filename, allowed_extensions):
    if ('.' not in filename or
            filename.split('.').pop().lower() not in allowed_extensions):
        raise BadRequest(
            "{0} has an invalid name or extension".format(filename))

def _safe_filename(filename):
    """
    Generates a safe filename that is unlikely to collide with existing objects
    in Google Cloud Storage.

    ``filename.ext`` is transformed into ``filename-YYYY-MM-DD-HHMMSS.ext``
    """
    filename = secure_filename(filename)
    date = datetime.datetime.utcnow().strftime("%Y-%m-%d-%H%M%S")
    basename, extension = filename.rsplit('.', 1)
    return "{0}-{1}.{2}".format(basename, date, extension)

def _safe_filename_v(filename,seat):
    """
    Generates a safe filename that is unlikely to collide with existing objects
    in Google Cloud Storage.
    ``filename.ext`` is transformed into ``filename-YYYY-MM-DD-HHMMSS.ext``
    """
    filename = secure_filename(filename)
    #date = datetime.datetime.utcnow().strftime("%Y%m%d%H%M%S")
    date = datetime.datetime.utcnow().strftime("%m%d%H%M%S")
    basename, extension = filename.rsplit('.', 1)
    return "{0}-_{1}{2}.{3}".format(basename,seat,date, extension)    

def upload_hw_file(file, filename, content_type,UPLOAD_FOLDER,seat):
    """
    Uploads a file to a given Cloud Storage bucket and returns the public url
    to the new object.
    """
    #_check_extension(filename, current_app.config['ALLOWED_EXTENSIONS'])
    filename = _safe_filename_v(filename,seat)
    #if file and allowed_file(file.filename):
    #filename = secure_filename(file.filename)
    file.save(os.path.join(UPLOAD_FOLDER, filename))
    return filename

def upload_file(file, filename, content_type,UPLOAD_FOLDER):
    """
    Uploads a file to a given Cloud Storage bucket and returns the public url
    to the new object.
    """
    _check_extension(filename, current_app.config['ALLOWED_EXTENSIONS'])
    filename = _safe_filename(filename)
    file.save(os.path.join(UPLOAD_FOLDER, filename))
    url = f"/lessons/99/img/{quote(filename)}"

    if isinstance(url, six.binary_type):
        url = url.decode('utf-8')

    return url
