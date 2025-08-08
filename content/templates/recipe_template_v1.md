---
tags: 
created: 
author: 
url:
---
Bereidingstijd: {{magicTime cookTime}}

Recept voor: {{recipeYield}}

![[{{image}}|500]]

{{{description}}}

### Ingredienten

{{#each recipeIngredient}}
- {{{this}}}
{{/each}}

### Instructies

{{#each recipeInstructions}}
{{#if this.itemListElement}}
#### {{{this.name}}}
{{#each this.itemListElement}}
1. {{{this.text}}}
{{/each}}
{{else if this.text}}
2. {{{this.text}}}
{{else}}
3. {{{this}}}
{{/if}}
{{/each}}

-----

## Aantekeningen
