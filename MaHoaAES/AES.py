from Sbox import sbox, rbox, rcon
import numpy as np
import os

def generate_key():
    return os.urandom(16)
def mul2(r):
    b = [0 for i in range(4)]
    for c in range(0, 4):
        h = (r[c] >> 7) & 1
        b[c] = r[c] << 1
        b[c] ^= h * 0x1B
    return b

def mul3(r):
    b = mul2(r);
    for c in range(0, 4):
        b[c] = b[c] ^ r[c]
    return b

def mul9(r):
    b = list.copy(r)
    for i in range(0, 3):
        b = mul2(b)
    for c in range(0, 4):
        b[c] ^= r[c]
    return b

def mul11(r):
    b = list.copy(r)
    b = mul2(b)
    b = mul2(b)
    for c in range(0, 4):
        b[c] ^= r[c]
    b = mul2(b)
    for c in range(0, 4):
        b[c] ^= r[c]
    return b

def mul13(r):
    b = list.copy(r)
    b = mul2(b)
    for c in range(0, 4):
        b[c] ^= r[c]
    b = mul2(b)
    b = mul2(b)
    for c in range(0, 4):
        b[c] ^= r[c]
    return b

def mul14(r):
    b = list.copy(r)
    b = mul2(b)
    for c in range(0, 4):
        b[c] ^= r[c]
    b = mul2(b)
    for c in range(0, 4):
        b[c] ^= r[c]
    b = mul2(b)
    return b
def rotWord(r):
    r[0], r[1], r[2], r[3] = r[1], r[2], r[3], r[0]
    return r
def keyExpansion128(key):
    retkey = []
    retkey.append(list.copy(key))
    for i in range(0, 10):
        newkey = []
        interkey = list.copy(retkey[-1])  # 4x4 array
        interkey = np.transpose(interkey)
        interkey = interkey.tolist()
        rconarr = [rcon[i], 0, 0, 0]
        workingarr = list.copy(interkey[-1])  # 1x4 array
        workingarr = rotWord(workingarr)
        for q in range(0, 4):
            workingarr[q] = sbox[workingarr[q]]
        for j in range(0, len(workingarr)):
            workingarr[j] = workingarr[j] ^ interkey[0][j] ^ rconarr[j]
        newkey.append(list.copy(workingarr))
        for k in range(1, 4):
            for j in range(0, 4):
                workingarr[j] = workingarr[j] ^ interkey[k][j]
            newkey.append(list.copy(workingarr))
        newkey = np.transpose(newkey)
        newkey = newkey.tolist()
        retkey.append(newkey)


    return retkey
def subBytes(r):
    for i in range(0, 4):
        for j in range(0, 4):
            r[i][j] = sbox[r[i][j]]
    return r


def shiftRows(r):
    r[1][0], r[1][1], r[1][2], r[1][3] = r[1][1], r[1][2], r[1][3], r[1][0]
    r[2][0], r[2][1], r[2][2], r[2][3] = r[2][2], r[2][3], r[2][0], r[2][1]
    r[3][0], r[3][1], r[3][2], r[3][3] = r[3][3], r[3][0], r[3][1], r[3][2]
    return r


def gMixColumn(r):
    a = [0, 0, 0, 0]  # [0 for i in range(4)]
    b = [0, 0, 0, 0]  # [0 for i in range(4)]
    r1 = [0, 0, 0, 0]

    for c in range(0, 4):
        a[c] = r[c]
        h = (r[c] >> 7) & 1
        b[c] = r[c] << 1
        b[c] ^= h * 0x1B

    r1[0] = (b[0] ^ a[3] ^ a[2] ^ b[1] ^ a[1]) % 256
    r1[1] = (b[1] ^ a[0] ^ a[3] ^ b[2] ^ a[2]) % 256
    r1[2] = (b[2] ^ a[1] ^ a[0] ^ b[3] ^ a[3]) % 256
    r1[3] = (b[3] ^ a[2] ^ a[1] ^ b[0] ^ a[0]) % 256

    return r1


def gMixColumns(d):
    r = list.copy(d)
    r = np.transpose(r)
    r = r.tolist()
    r1 = []

    for i in range(0, 4):
        r[i] = gMixColumn(r[i])
        r1.append(r[i])

    r1 = np.transpose(r1)
    r1 = r1.tolist()
    return r1


def AES128_encrypt(state, cypherkey):
    print("AES128_encrypt")
    roundKey = keyExpansion128(cypherkey)  # 11 x (4 x 4) array

    result = list.copy(state)
    for i in range(0, 4):
        for j in range(0, 4):
            result[i][j] = state[i][j] ^ roundKey[0][i][j]

    for q in range(1, 10):
        result = subBytes(result)
        result = shiftRows(result)
        result = gMixColumns(result)
        for i in range(0, 4):
            for j in range(0, 4):
                result[i][j] = result[i][j] ^ roundKey[q][i][j]
    result = subBytes(result)
    result = shiftRows(result)
    for i in range(0, 4):
        for j in range(0, 4):
            result[i][j] = result[i][j] ^ roundKey[10][i][j]

    return result


def invSubBytes(r):
    for i in range(0, 4):
        for j in range(0, 4):
            r[i][j] = rbox[r[i][j]]
    return r


def invShiftRows(r):
    r[1][0], r[1][1], r[1][2], r[1][3] = r[1][3], r[1][0], r[1][1], r[1][2]
    r[2][0], r[2][1], r[2][2], r[2][3] = r[2][2], r[2][3], r[2][0], r[2][1]
    r[3][0], r[3][1], r[3][2], r[3][3] = r[3][1], r[3][2], r[3][3], r[3][0]
    return r


def gInvMixColumn(r):
    a = mul9(r)
    b = mul11(r)
    c = mul13(r)
    d = mul14(r)

    ret = [0, 0, 0, 0]

    ret[0] = (d[0] ^ b[1] ^ c[2] ^ a[3]) % 256
    ret[1] = (a[0] ^ d[1] ^ b[2] ^ c[3]) % 256
    ret[2] = (c[0] ^ a[1] ^ d[2] ^ b[3]) % 256
    ret[3] = (b[0] ^ c[1] ^ a[2] ^ d[3]) % 256

    return ret


def gInvMixColumns(d):
    r = list.copy(d)
    r = np.transpose(r)
    r = r.tolist()
    r1 = []

    for i in range(0, 4):
        r[i] = gInvMixColumn(r[i])
        r1.append(r[i])

    r1 = np.transpose(r1)
    r1 = r1.tolist()
    return r1


def AES128_decrypt(state, cypherkey):
    roundKey = keyExpansion128(cypherkey)  # 11 x (4 x 4) array

    result = list.copy(state)

    for i in range(0, 4):
        for j in range(0, 4):
            result[i][j] = state[i][j] ^ roundKey[10][i][j]

    for q in range(9, 0, -1):
        result = invShiftRows(result)
        result = invSubBytes(result)
        for i in range(0, 4):
            for j in range(0, 4):
                result[i][j] = result[i][j] ^ roundKey[q][i][j]
        result = gInvMixColumns(result)

    result = invShiftRows(result)
    result = invSubBytes(result)
    for i in range(0, 4):
        for j in range(0, 4):
            result[i][j] = result[i][j] ^ roundKey[0][i][j]

    return result

def decrypt(state = None, key = None):
    ret = ""
    lenkey = 0
    lenkey = len(key)

    res = [state[y - 16:y] for y in range(16, len(state) + 16, 16)]
    lim = 16 - len(res[-1])
    for i in range(0, lim):
        res[-1] += chr(0x00)
    key = stringToMat(key)
    cypherkey = key
    for i in res:
        sub = stringToMat(i)
        sub = AES128_decrypt(sub, cypherkey)
        sub = matToString(sub)
        ret += sub
    return ret

def stringToMat(s):
    ret = []
    interkey = []

    for i in range(0, len(s)):
        interkey.append(ord(s[i]))
        if ((i % 4 == 3)):
            ret.append(interkey)
            interkey = []

    ret = np.transpose(ret)
    ret = ret.tolist()
    return ret
def hexaToMat(s):
    ret = []
    interkey = []

    s = [s[y - 2:y] for y in range(2, len(s) + 2, 2)]

    for i in range(0, len(s)):
        interkey.append(int(s[i], 16))
        if ((i % 4 == 3)):
            ret.append(interkey)
            interkey = []

    ret = np.transpose(ret)
    ret = ret.tolist()
    return ret

def matToString(s):
     s = np.transpose(s)
     s = np.ravel(s)
     s = s.tolist()
     return ''.join([chr(i) for i in s])
def xorMatrix(a, b):
    ret = [[0 for i in range(len(a[0]))] for k in range(len(a))]
    for i in range(len(a)):
        for j in range(len(a[0])):
            ret[i][j] = a[i][j] ^ b[i][j]
    return ret
def encrypt(state = None, key = None):
    ret = ""
    lenkey = 0
    lenkey = len(key)

    res = [state[y - 16:y] for y in range(16, len(state) + 16, 16)]
    lim = 16 - len(res[-1])
    for i in range(0, lim):
        res[-1] += chr(0x00)
    key = stringToMat(key)
    cypherkey = key
    for i in res:
        sub = stringToMat(i)
        sub = AES128_encrypt(sub, cypherkey)
        sub = matToString(sub)
        ret += sub
    return ret
def main():
    print(encrypt("", "0123456789abcdef"))
    print(decrypt(encrypt("0123456789abcdef", "0123456789abcdef"), "0123456789abcdef"))
if __name__ == "__main__":
    main()