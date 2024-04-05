import { HttpClient, HttpDownloadProgressEvent, HttpEvent, HttpEventType, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { filter, map, Observable, of } from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class GeneratorService {
  public loadingResponse!: boolean;
  public fakeText = "There are many variations of passages of Lorem Ipsum available, but the majority have suffered alteration in some form, by injected humour, or randomised words which don't look even slightly believable. If you are going to use a passage of Lorem Ipsum, you need to be sure there isn't anything embarrassing hidden in the middle of text. All the Lorem Ipsum generators on the Internet tend to repeat predefined chunks as necessary, making this the first true generator on the Internet. It uses a dictionary of over 200 Latin words, combined with a handful of model sentence structures, to generate Lorem Ipsum which looks reasonable. The generated Lorem Ipsum is therefore always free from repetition, injected humour, or non-characteristic words etc.";
  constructor(private http: HttpClient) {}

  public fakeGenerate(): Observable<string> {
    return of(...(this.fakeText.split(' ')));
  }

  public generate(theme: string, tone: string, language: string, keywords: string) {
    this.loadingResponse = true;
    let prompt = `Write a text long of 30 words, about ${theme}, use a ${tone} tone in your writing. Write in ${language}`;
    if (keywords) prompt += `Use the following keywords in the text you create: ${keywords}`;
    const body = {
      model: 'TheBloke/Mistral-7B-Instruct-v0.2-GGUF/mistral-7b-instruct-v0.2.Q4_K_S.gguf',
      messages: [
        { role: 'system', content: 'You are a proefficient writter, your goal to help at writing text content' },
        { role: 'user', content: prompt },
      ],
      temperature: 0.7,
      max_tokens: -1,
      stream: true,
    };
     const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });
    return this.http.post(
      "http://localhost:1234/v1/chat/completions",
      body,
      { headers, observe: 'events', responseType: 'text', reportProgress: true  }
    ).pipe(
      filter((event: HttpEvent<string>) => event.type === HttpEventType.DownloadProgress),
      map((event:HttpEvent<string>) => {
        return (event as HttpDownloadProgressEvent).partialText;
      }),
      map(partialText => {
        return (partialText || '').trim().split('\n')
          .filter(item => !!item)
          .reduce(
            (content, item) => {
              if (item === 'data: [DONE]') {
                this.loadingResponse = false;
                return content;
              }
              const { choices: [elemet] } = JSON.parse(item.replace('data: ', ''))

              return content += elemet.delta.content || '';
            },
            ''
          );
      })
    );
  }
};
