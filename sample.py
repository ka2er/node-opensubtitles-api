import struct, os

def hashFile(name, size):
      try:

                longlongformat = 'q'  # long long
                bytesize = struct.calcsize(longlongformat)

                f = open(name, "rb")

                filesize = os.path.getsize(name)
                print filesize
                print "-------"
                hash = 0

                if filesize < size * 2:
                       return "SizeError"

                for x in range(size/bytesize):
                        buffer = f.read(bytesize)
                        (l_value,)= struct.unpack(longlongformat, buffer)
                        #print hash
                        #print "hash#1 %d %016x" % (x, l_value)
                        hash += l_value
                        hash = hash & 0xFFFFFFFFFFFFFFFF #to remain as 64bit number

                print "start buffer chcksum"
                print "%016x" % hash


                hash2 = 0
                f.seek(max(0,filesize-size),0)
                for x in range(size/bytesize):
                        buffer = f.read(bytesize)
                        (l_value,)= struct.unpack(longlongformat, buffer)
                        hash2 += l_value
                        hash2 = hash2 & 0xFFFFFFFFFFFFFFFF
                        print "hash#2 %d %016x => %016x" % (x, l_value, hash2)

                f.close()

                print "end buffer chcksum"
                print "%016x" % hash2

				# hash+size a la fin
                hash += filesize

                hash += hash2

                returnedhash =  "%016x" % hash
                return returnedhash

      except(IOError):
                return "IOError"


print hashFile('/home/seb/dev/node-opensubtitles-api/test/breakdance.avi', 256);