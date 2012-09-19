function(doc) {
  if("Common" == doc.doc_type && true == doc.isMine) {
      emit(doc.date, doc);
  }
}

