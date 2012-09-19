function(doc) {
  if("Picture" == doc.doc_type && true == doc.isMine) {
      emit(doc.date, doc);
  }
}

