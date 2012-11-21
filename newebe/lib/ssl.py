from M2Crypto import X509, EVP, RSA, Rand, ASN1, m2, util, BIO


class CertBuilder(object):

    def mkreq(self, bits, ca=0):
        pk = EVP.PKey()
        x = X509.Request()
        rsa = RSA.gen_key(bits, 65537, self.callback)
        pk.assign_rsa(rsa)
        x.set_pubkey(pk)
        name = x.get_subject()
        name.C = "FR"
        name.CN = "OpenSSL Group"
        if not ca:
            ext1 = X509.new_extension('subjectAltName', 'DNS:foobar.example.com')
            ext2 = X509.new_extension('nsComment', 'Hello there')
            extstack = X509.X509_Extension_Stack()
            extstack.push(ext1)
            extstack.push(ext2)
            x.add_extensions(extstack)
        x.sign(pk,'sha1')

        return x, pk

    def save_certs(self):
        (req, _) = self.mkreq(1024)
        req.save_pem('./tmp_request.pem')
