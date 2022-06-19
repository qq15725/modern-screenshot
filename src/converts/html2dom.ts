export async function html2dom(html: string): Promise<ChildNode | null> {
  const template = document.createElement('template')
  template.innerHTML = html.trim()
  return template.content.firstChild
}
