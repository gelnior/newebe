function(doc) {
  if("Common" == doc.doc_type) {
      emit(doc.date, doc);
  }
}

