import crypto from "crypto";
import { Request, Response } from "express";

export default class FatSecretController {
  private consumerKey: string;
  private consumerSecret: string;

  constructor() {
    this.consumerKey = process.env.FATSECRET_KEY!;
    this.consumerSecret = process.env.FATSECRET_SECRET!;
  }

  private buildOAuthParams(method: string, url: string, extraParams: Record<string, string>) {
    const oauthParams: Record<string, string> = {
      oauth_consumer_key: this.consumerKey,
      oauth_nonce: Math.random().toString(36).substring(2),
      oauth_signature_method: "HMAC-SHA1",
      oauth_timestamp: Math.floor(Date.now() / 1000).toString(),
      oauth_version: "1.0",
    };

    const allParams = { ...oauthParams, ...extraParams };

    const paramString = Object.keys(allParams)
      .sort()
      .map((k) => `${encodeURIComponent(k)}=${encodeURIComponent(allParams[k])}`)
      .join("&");

    const baseString = [
      method.toUpperCase(),
      encodeURIComponent(url),
      encodeURIComponent(paramString),
    ].join("&");

    const signingKey = `${this.consumerSecret}&`;
    const signature = crypto
      .createHmac("sha1", signingKey)
      .update(baseString)
      .digest("base64");

    return { ...oauthParams, ...extraParams, oauth_signature: signature };
  }

  private async callFatSecret(method: string, params: Record<string, string>) {
    const url = "https://platform.fatsecret.com/rest/server.api";
    const signedParams = this.buildOAuthParams("GET", url, { method, format: "json", ...params });
    const query = new URLSearchParams(signedParams).toString();
    const response = await fetch(`${url}?${query}`);
    return response.json();
  }

  // 🔹 GET /api/foods?q=banana
  public buscarAlimentos = async (req: Request, res: Response) => {
    const q = req.query.q as string;
    try {
      const data = await this.callFatSecret("foods.search", { search_expression: q });
      res.json(data);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Erro ao buscar alimentos" });
    }
  };

  // 🔹 GET /api/food/:id
  public detalheAlimento = async (req: Request, res: Response) => {
    const id = req.params.id;
    try {
      const data = await this.callFatSecret("food.get", { food_id: id });
      res.json(data);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Erro ao obter detalhes do alimento" });
    }
  };

  // 🔹 GET /api/recipes?q=frango
  public buscarReceitas = async (req: Request, res: Response) => {
    const q = req.query.q as string;
    try {
      const data = await this.callFatSecret("recipes.search", { search_expression: q });
      res.json(data);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Erro ao buscar receitas" });
    }
  };

  // 🔹 GET /api/exercise/:id
  public detalheExercicio = async (req: Request, res: Response) => {
    const id = req.params.id;
    try {
      const data = await this.callFatSecret("exercise.get", { exercise_id: id });
      res.json(data);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Erro ao buscar exercício" });
    }
  };
}