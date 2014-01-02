function(doc) {
  if("MicroPost" == doc.doc_type) {
    for(i=0; i < doc.pictures_to_download.length; i++) {
      emit(doc.pictures_to_download[i], doc);
    }
  }
}

