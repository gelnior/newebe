function(doc) {
  if("Activity" == doc.doc_type) {
    emit(doc._id, doc);
  }
}
