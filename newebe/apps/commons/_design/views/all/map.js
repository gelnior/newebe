function(doc) {
  if("Common" == doc.doc_type) {
      emit(doc._id, doc);
  }
}

