module.exports = async (req, res) => {
  res.status(200).json({ 
    message: 'API funcionando!',
    method: req.method,
    timestamp: new Date().toISOString()
  });
};
```

---

## 🔄 DEPOIS:

1. **Salva**
2. **Commit**
3. **Push**
4. **Aguarda deploy**

---

## 🔍 TESTA:
```
https://receitafit-app.vercel.app/api/test
