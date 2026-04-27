import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import { downloadFile } from '@/logmake/lib/utils/downloadFile'

describe('downloadFile', () => {
  let createObjectURLSpy: ReturnType<typeof vi.fn>
  let revokeObjectURLSpy: ReturnType<typeof vi.fn>
  let appendChildSpy: ReturnType<typeof vi.fn>
  let removeChildSpy: ReturnType<typeof vi.fn>
  let clickSpy: ReturnType<typeof vi.fn>

  beforeEach(() => {
    vi.useFakeTimers()

    createObjectURLSpy = vi.fn().mockReturnValue('blob:mock-url')
    revokeObjectURLSpy = vi.fn()
    clickSpy = vi.fn()

    global.URL.createObjectURL = createObjectURLSpy
    global.URL.revokeObjectURL = revokeObjectURLSpy

    appendChildSpy = vi.spyOn(document.body, 'appendChild').mockImplementation((node) => node)
    removeChildSpy = vi.spyOn(document.body, 'removeChild').mockImplementation((node) => node)

    vi.spyOn(HTMLAnchorElement.prototype, 'click').mockImplementation(clickSpy)
  })

  afterEach(() => {
    vi.useRealTimers()
    vi.restoreAllMocks()
  })

  it('creates an object URL and triggers a download click', () => {
    const blob = new Blob(['test content'], { type: 'text/plain' })
    downloadFile(blob, 'output.txt')

    expect(createObjectURLSpy).toHaveBeenCalledWith(blob)
    expect(clickSpy).toHaveBeenCalledTimes(1)
  })

  it('sets the correct download filename on the anchor element', () => {
    const blob = new Blob(['content'])
    let capturedLink: HTMLAnchorElement | undefined

    appendChildSpy.mockImplementation((node: Node) => {
      capturedLink = node as HTMLAnchorElement
      return node
    })

    downloadFile(blob, 'my-log.html')

    expect(capturedLink?.download).toBe('my-log.html')
    expect(capturedLink?.href).toContain('blob:mock-url')
  })

  it('appends and removes the link from the DOM', () => {
    const blob = new Blob(['content'])
    downloadFile(blob, 'test.html')

    expect(appendChildSpy).toHaveBeenCalledTimes(1)
    expect(removeChildSpy).toHaveBeenCalledTimes(1)
  })

  it('revokes the object URL after click (via setTimeout)', async () => {
    const blob = new Blob(['content'])
    downloadFile(blob, 'test.html')

    expect(revokeObjectURLSpy).not.toHaveBeenCalled()

    await vi.runAllTimersAsync()
    expect(revokeObjectURLSpy).toHaveBeenCalledWith('blob:mock-url')
  })
})
