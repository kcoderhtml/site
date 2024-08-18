import AirtablePlus from "airtable-plus";
import { ensureAuthed } from "../../login/test";
import { update } from "lodash";

export default async function handler(req, res) {
  const user = await ensureAuthed(req)
  if (user.error) {
    return res.status(401).json(user)
  }

  const body = req.body
  if (!body) {
    return res.status(400).json({ error: "No body provided" })
  }


  const updatedFields = {}
  updatedFields['Name'] = body.title
  updatedFields['Description'] = body.desc
  updatedFields['Slack Link'] = body.slackLink
  updatedFields['Code Link'] = body.codeLink
  updatedFields['Play Link'] = body.playLink
  updatedFields['Screenshot'] = body.images
  updatedFields['color'] = body.color
  updatedFields['textColor'] = body.textColor
  updatedFields['ScreenshotLinks'] = body.screenshot
  updatedFields['VideoLinks'] = body.video

  console.log(body.color)

  const airtable = new AirtablePlus({
    apiKey: process.env.AIRTABLE_API_KEY,
    baseID: 'app4kCWulfB02bV8Q',
    tableName: "Showcase"
  })

  const { projectID } = req.query

  const project = await airtable.update(projectID, updatedFields )

  const results = {
    id: project.id,
    title: project.fields['Name'] || '',
    desc: project.fields['Description'] || '',
    slackLink: project.fields['Slack Link'] || '',
    codeLink: project.fields['Code Link'] || '',
    slackLink: project.fields['Slack Link'] || '',
    playLink: project.fields['Play Link'] || '',
    images: (project.fields['Screenshot'] || []).map(i => i.url),
    user: user.fields['Name'],
    githubProf: project.fields['Github Profile'] || '',
    color: project.fields['color'] || '',
    textColor: project.fields['textColor'] || '',
    screenshot: JSON.parse(p.fields['ScreenshotLinks']) || [],
    video: JSON.parse(p.fields['VideoLinks']) || [],

  }

  return res.status(200).json({ project: results })
}