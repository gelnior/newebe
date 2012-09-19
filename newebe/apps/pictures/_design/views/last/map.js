function(doc) {
  if("Picture" == doc.doc_type) {
      emit(doc.date, doc);
  }
}

