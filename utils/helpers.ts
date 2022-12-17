import { NextApiRequest } from "next";
export const filter = (items: string[], term: string): string[] => {
  term = term.toLocaleLowerCase();
  const result = [];

  items.forEach((item: string) => {
    if (item.toLocaleLowerCase().indexOf(term) > -1) {
      result.push(item);
    } else {
      result.splice(result.indexOf(term), 1);
    }
  });
  return result;
};

export const getParam = (req: NextApiRequest, param: string) => {
  return Array.isArray(req.query[param])
    ? req.query[param][0]
    : req.query[param];
};

export const submitMutation = (
  e,
  mutate,
  notify = null,
  additionalData = {}
) => {
  e.preventDefault();
  const formData = Object.fromEntries(new FormData(e.target).entries());
  let validData = true;
  for (const item in formData) {
    if (item.replaceAll(" ", "") === "" && notify) {
      notify("error", "Vyplňte prosím všechna pole.");
      validData = false;
      break;
    }
  }
  if (validData || !notify) mutate({ ...formData, ...additionalData });
};
