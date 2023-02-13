export const $addr = (addr: string) => {
    const temp = addr.startsWith('0x') ? addr : `0x${addr}`
    return temp.substring(0, 8) + '…' + temp.substring(temp.length - 8, temp.length)
}