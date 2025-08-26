export async function shareLink({ title, text, url }:{title:string;text:string;url:string}){
    if (navigator.share){
      try{
        await navigator.share({ title, text, url })
        return
      }catch{ /* fall through */ }
    }
    try{
      await navigator.clipboard.writeText(url)
      alert('Link copied')
    }catch{
      prompt('Copy this link:', url)
    }
  }
  