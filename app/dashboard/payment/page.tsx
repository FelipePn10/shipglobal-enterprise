"use client"

import { useState, useEffect, useRef } from "react"
import { motion, AnimatePresence, useMotionValue, useTransform, useSpring } from "framer-motion"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { 
  DollarSign, Moon, CreditCard, Gift, Shield, Sparkles, ArrowRight, 
  Clock, ChevronDown, Check, X, Zap, Globe, Lock, 
  TrendingUp, CreditCard as CardIcon, Tag
} from "lucide-react"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { useTheme } from "next-themes"
import { cn } from "@/lib/utils"

// Interactive Mouse Follower Element
const MouseFollower = () => {
  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)
  
  const followerX = useSpring(mouseX, { stiffness: 1000, damping: 100 })
  const followerY = useSpring(mouseY, { stiffness: 1000, damping: 100 })
  
  useEffect(() => {
    const handleMouseMove = (e) => {
      mouseX.set(e.clientX)
      mouseY.set(e.clientY)
    }
    
    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [mouseX, mouseY])
  
  return (
    <motion.div 
      className="fixed w-4 h-4 rounded-full pointer-events-none z-50 mix-blend-screen opacity-50 bg-gradient-to-r from-violet-500 to-indigo-500"
      style={{
        x: followerX,
        y: followerY,
        translateX: "-50%",
        translateY: "-50%",
      }}
      transition={{
        type: "spring",
        damping: 25,
        stiffness: 250
      }}
    />
  )
}

// Interactive Amount Selector with Haptic Feedback
const AmountSelector = ({ amount, setAmount }) => {
  const presetAmounts = [20, 50, 100, 200, 500]
  const [customAmount, setCustomAmount] = useState(amount.toString())
  const [activePreset, setActivePreset] = useState(() => 
    presetAmounts.includes(amount) ? amount : null
  )
  
  const handleCustomChange = (e) => {
    const value = e.target.value
    setCustomAmount(value)
    const numValue = parseFloat(value)
    if (!isNaN(numValue)) {
      setAmount(numValue)
      setActivePreset(presetAmounts.includes(numValue) ? numValue : null)
    }
  }
  
  const handlePresetClick = (preset) => {
    setAmount(preset)
    setCustomAmount(preset.toString())
    setActivePreset(preset)
    
    // Simulate haptic feedback
    if (window.navigator.vibrate) {
      window.navigator.vibrate(50)
    }
    
    // Audio feedback (subtle click sound)
    const audio = new Audio("data:audio/mp3;base64,//uQxAAAAAAAAAAAAAAAAAAAAAAAWGluZwAAAA8AAAACAAACcQCAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA//////////////////////////////////////////////////////////////////8AAAA8TEFNRTMuOTkuNVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV")
    audio.volume = 0.1
    audio.play().catch(e => console.log('Audio play failed', e))
  }
  
  return (
    <div className="space-y-4">
      <div className="bg-zinc-900/70 backdrop-blur-sm rounded-xl p-6 border border-zinc-800">
        <Label htmlFor="amount" className="text-zinc-400 mb-3 block">Amount (USD)</Label>
        
        <div className="relative">
          <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
            <DollarSign className="h-5 w-5 text-violet-400" />
          </div>
          <Input
            type="text"
            id="amount"
            value={customAmount}
            onChange={handleCustomChange}
            className="pl-10 bg-zinc-800/50 border-zinc-700 text-white text-2xl h-14 font-bold focus:ring-2 focus:ring-violet-500 focus:border-transparent"
          />
        </div>
      </div>
      
      <div className="flex flex-wrap gap-2 mt-4">
        {presetAmounts.map((preset) => (
          <motion.button
            key={preset}
            whileTap={{ scale: 0.95 }}
            onClick={() => handlePresetClick(preset)}
            className={cn(
              "flex-1 py-3 px-4 rounded-xl font-medium transition-all text-center min-w-20",
              activePreset === preset 
                ? "bg-gradient-to-r from-violet-600 to-indigo-600 text-white shadow-lg shadow-violet-700/30" 
                : "bg-zinc-800/50 text-zinc-300 border border-zinc-700 hover:bg-zinc-700"
            )}
          >
            ${preset}
          </motion.button>
        ))}
      </div>
      
      <motion.div
        initial={{ height: 0, opacity: 0 }}
        animate={{ height: "auto", opacity: 1 }}
        className="pt-4"
      >
        <Label className="text-zinc-400 mb-3 block">Adjust with slider</Label>
        <Slider
          value={[amount]}
          min={1}
          max={1000}
          step={1}
          onValueChange={(value) => {
            setAmount(value[0])
            setCustomAmount(value[0].toString())
            setActivePreset(presetAmounts.includes(value[0]) ? value[0] : null)
          }}
          className="py-4"
        />
      </motion.div>
    </div>
  )
}

// Interactive 3D Floating Card Component
const FloatingCard = ({ amount, paymentMethod, onFlip }) => {
  const rotateX = useMotionValue(0)
  const rotateY = useMotionValue(0)
  const cardRef = useRef(null)
  const [isFlipped, setIsFlipped] = useState(false)
  
  useEffect(() => {
    const handleMouseMove = (e) => {
      if (!cardRef.current) return
      
      const rect = cardRef.current.getBoundingClientRect()
      const centerX = rect.left + rect.width / 2
      const centerY = rect.top + rect.height / 2
      
      const percentX = (e.clientX - centerX) / (rect.width / 2)
      const percentY = (e.clientY - centerY) / (rect.height / 2)
      
      // Limit rotation to subtle effect
      rotateX.set(-percentY * 10)
      rotateY.set(percentX * 10)
    }
    
    const handleMouseLeave = () => {
      rotateX.set(0)
      rotateY.set(0)
    }
    
    const card = cardRef.current
    if (card) {
      card.addEventListener('mousemove', handleMouseMove)
      card.addEventListener('mouseleave', handleMouseLeave)
      
      return () => {
        card.removeEventListener('mousemove', handleMouseMove)
        card.removeEventListener('mouseleave', handleMouseLeave)
      }
    }
  }, [rotateX, rotateY])
  
  const getPaymentIcon = () => {
    switch(paymentMethod) {
      case "card": return <CreditCard className="h-8 w-8 opacity-80" />
      case "paypal": return <Gift className="h-8 w-8 opacity-80" />
      case "apple": return <Shield className="h-8 w-8 opacity-80" />
      case "crypto": return <Sparkles className="h-8 w-8 opacity-80" />
      default: return <CreditCard className="h-8 w-8 opacity-80" />
    }
  }
  
  const handleFlip = () => {
    setIsFlipped(!isFlipped)
    if (onFlip) onFlip()
  }
  
  return (
    <motion.div
      ref={cardRef}
      className="w-full h-60 rounded-2xl perspective-card mb-6 cursor-pointer relative"
      style={{
        rotateX,
        rotateY,
        transformStyle: "preserve-3d",
      }}
      animate={{ rotateY: isFlipped ? 180 : 0 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      onClick={handleFlip}
      whileHover={{ scale: 1.02 }}
    >
      {/* Card Front */}
      <motion.div 
        className="absolute inset-0 rounded-2xl overflow-hidden backface-hidden"
        style={{ backfaceVisibility: "hidden" }}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-violet-600 via-indigo-600 to-purple-700 opacity-90" />
        
        {/* Animated holographic pattern */}
        <motion.div 
          className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,_rgba(255,255,255,0.2)_0%,_transparent_50%)] opacity-30"
          animate={{ 
            background: [
              "radial-gradient(circle at 20% 30%, rgba(255,255,255,0.2) 0%, transparent 50%)",
              "radial-gradient(circle at 70% 60%, rgba(255,255,255,0.2) 0%, transparent 50%)",
              "radial-gradient(circle at 40% 80%, rgba(255,255,255,0.2) 0%, transparent 50%)",
              "radial-gradient(circle at 20% 30%, rgba(255,255,255,0.2) 0%, transparent 50%)",
            ]
          }}
          transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
        />
        
        <div className="absolute inset-0 p-6 flex flex-col justify-between text-white">
          <div className="flex justify-between items-center">
            <div className="text-xs opacity-80 font-medium">Virtual Payment Card</div>
            {getPaymentIcon()}
          </div>
          
          <div className="space-y-4">
            <div className="flex space-x-3">
              {[1, 2, 3, 4].map((_, i) => (
                <motion.div 
                  key={i} 
                  className="h-1 w-6 rounded-full bg-white/60"
                  initial={{ opacity: 0.6 }}
                  animate={{ opacity: [0.3, 0.8, 0.3] }}
                  transition={{ 
                    duration: 2, 
                    repeat: Infinity, 
                    delay: i * 0.3,
                    ease: "easeInOut" 
                  }}
                />
              ))}
            </div>
            
            <div className="flex justify-between items-end">
              <div>
                <div className="text-xs opacity-80 mb-1">Current Amount</div>
                <motion.div 
                  className="text-2xl font-bold"
                  key={amount}
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  ${amount.toFixed(2)}
                </motion.div>
              </div>
              <motion.div 
                whileHover={{ rotate: 360 }}
                transition={{ duration: 0.8 }}
                className="h-12 w-12 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center"
              >
                <Sparkles className="h-6 w-6 text-white" />
              </motion.div>
            </div>
          </div>
        </div>
      </motion.div>
      
      {/* Card Back */}
      <motion.div 
        className="absolute inset-0 rounded-2xl overflow-hidden backface-hidden"
        style={{ backfaceVisibility: "hidden", rotateY: 180, transformStyle: "preserve-3d" }}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-700 via-violet-600 to-purple-800 opacity-90" />
        
        <div className="absolute top-0 left-0 right-0 h-12 bg-zinc-800/50 mt-6" />
        
        <div className="absolute inset-0 p-6 flex flex-col justify-between text-white">
          <div className="flex justify-end">
            <div className="text-xs opacity-80">Flip to see front</div>
          </div>
          
          <div className="mt-8 space-y-4">
            <div className="w-full bg-zinc-800/50 h-10 rounded-md flex items-center px-4">
              <div className="text-xs opacity-70 mr-auto">Security Code</div>
              <div className="font-mono font-bold">***</div>
            </div>
            
            <div className="text-xs opacity-70">
              This is a virtual card. Use securely for online payments only.
            </div>
            
            <div className="flex items-center gap-2 text-xs">
              <Lock className="h-3 w-3" />
              <span className="opacity-70">Protected with end-to-end encryption</span>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  )
}

// Live Currency Converter with Animations
const CurrencyConverter = ({ amount }) => {
  const currencies = [
    { code: "EUR", symbol: "€", name: "Euro", rate: 0.92, change: "+0.2%" },
    { code: "GBP", symbol: "£", name: "British Pound", rate: 0.78, change: "-0.1%" },
    { code: "JPY", symbol: "¥", name: "Japanese Yen", rate: 110.45, change: "+0.5%" },
    { code: "CAD", symbol: "$", name: "Canadian Dollar", rate: 1.35, change: "-0.3%" },
    { code: "CNY", symbol: "¥", name: "Chinese Yuan", rate: 7.25, change: "+0.1%" },
    { code: "AUD", symbol: "$", name: "Australian Dollar", rate: 1.48, change: "-0.2%" },
  ]
  
  const [expanded, setExpanded] = useState(false)
  
  return (
    <motion.div 
      className="space-y-3 bg-zinc-900/70 backdrop-blur-sm rounded-xl p-5 border border-zinc-800"
      layout
    >
      <div className="flex justify-between items-center">
        <h3 className="text-sm font-medium text-zinc-400 flex items-center">
          <Globe className="h-4 w-4 mr-2 text-violet-400" />
          Currency Conversion
        </h3>
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={() => setExpanded(!expanded)}
          className="text-zinc-400 h-8 px-2"
        >
          <motion.div
            animate={{ rotate: expanded ? 180 : 0 }}
            transition={{ duration: 0.3 }}
          >
            <ChevronDown className="h-4 w-4" />
          </motion.div>
        </Button>
      </div>
      
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
        {currencies.slice(0, expanded ? currencies.length : 4).map((currency) => (
          <motion.div
            key={currency.code}
            layout
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="rounded-xl bg-zinc-900/50 border border-zinc-800 p-4 backdrop-blur-sm relative overflow-hidden group hover:border-violet-500/50 transition-all"
          >
            <div className="absolute -right-8 -top-8 h-16 w-16 bg-violet-500/10 rounded-full opacity-0 group-hover:opacity-100 transition-all" />
            
            <div className="flex justify-between mb-2">
              <p className="text-sm font-medium text-zinc-400">{currency.code}</p>
              <p className={cn(
                "text-xs font-medium",
                currency.change.startsWith('+') ? "text-green-500" : "text-red-500"
              )}>
                {currency.change}
              </p>
            </div>
            
            <div className="flex items-baseline">
              <p className="text-xl font-bold text-white">
                {currency.symbol}{(amount * currency.rate).toFixed(2)}
              </p>
              <p className="text-xs text-zinc-500 ml-1">{currency.name}</p>
            </div>
            
            <motion.div
              className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-violet-500 to-indigo-500"
              initial={{ scaleX: 0 }}
              whileHover={{ scaleX: 1 }}
              transition={{ duration: 0.3 }}
              style={{ transformOrigin: "left" }}
            />
          </motion.div>
        ))}
      </div>
      
      {expanded && (
        <div className="pt-3 text-center text-sm text-zinc-500">
          <p>Rates updated: <Clock className="h-3 w-3 inline mr-1" /> 3 minutes ago</p>
        </div>
      )}
    </motion.div>
  )
}

// Interactive Payment Method Selector
const PaymentMethod = ({ selected, onSelect }) => {
  const methods = [
    { id: "card", name: "Credit Card", icon: CreditCard, description: "Visa, Mastercard, Amex" },
    { id: "paypal", name: "PayPal", icon: Gift, description: "Fast and secure" },
    { id: "apple", name: "Apple Pay", icon: Shield, description: "Quick touch payment" },
    { id: "crypto", name: "Crypto", icon: Sparkles, description: "BTC, ETH, USDC" }
  ]
  
  return (
    <div className="space-y-4 bg-zinc-900/70 backdrop-blur-sm rounded-xl p-5 border border-zinc-800">
      <h3 className="text-sm font-medium text-zinc-400 flex items-center">
        <CardIcon className="h-4 w-4 mr-2 text-violet-400" />
        Payment Method
      </h3>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
        {methods.map((method) => {
          const Icon = method.icon
          const isSelected = selected === method.id
          
          return (
            <motion.div
              key={method.id}
              whileHover={{ y: -4 }}
              whileTap={{ scale: 0.98 }}
              animate={isSelected ? { scale: [1, 1.03, 1] } : { scale: 1 }}
              transition={{ duration: 0.2 }}
            >
              <button
                onClick={() => onSelect(method.id)}
                className={cn(
                  "w-full flex flex-col items-center justify-center rounded-xl p-4 transition-all h-full",
                  "hover:bg-zinc-800/70 border focus:outline-none focus:ring-2 focus:ring-violet-500 relative overflow-hidden",
                  isSelected
                    ? "border-violet-500 bg-zinc-900/80 text-white shadow-lg shadow-violet-900/20"
                    : "border-zinc-800 bg-zinc-900/50 text-zinc-400"
                )}
              >
                {isSelected && (
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-br from-violet-500/10 to-indigo-500/5"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  />
                )}
                
                <div className={cn(
                  "flex items-center justify-center w-12 h-12 rounded-full mb-3 transition-all",
                  isSelected 
                    ? "bg-violet-500/20 text-violet-400" 
                    : "bg-zinc-800 text-zinc-500"
                )}>
                  <Icon className="h-6 w-6" />
                </div>
                
                <span className={cn(
                  "text-base font-medium mb-1 transition-all",
                  isSelected ? "text-white" : "text-zinc-300"
                )}>
                  {method.name}
                </span>
                
                <span className="text-xs text-zinc-500">
                  {method.description}
                </span>
                
                {isSelected && (
                  <motion.div
                    className="absolute -bottom-1 left-0 right-0 h-1 bg-gradient-to-r from-violet-500 to-indigo-500"
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: 1 }}
                    exit={{ scaleX: 0 }}
                    transition={{ duration: 0.3 }}
                  />
                )}
              </button>
            </motion.div>
          )
        })}
      </div>
    </div>
  )
}

// Interactive Subscription Cards with 3D Effect
const SubscriptionCard = ({ title, price, features, selected, onSelect, popularFlag, savings }) => {
  const [hovered, setHovered] = useState(false)
  
  return (
    <motion.div
      whileHover={{ 
        y: -8,
        transition: { duration: 0.3 }
      }}
      onHoverStart={() => setHovered(true)}
      onHoverEnd={() => setHovered(false)}
      animate={{ 
        scale: selected ? 1.02 : 1,
        y: selected ? -5 : 0
      }}
      className={cn(
        "rounded-2xl h-full overflow-hidden backdrop-blur-md transition-all relative",
        selected 
          ? "border-2 border-violet-500 bg-gradient-to-b from-zinc-900 to-zinc-950 shadow-lg shadow-violet-900/20" 
          : "border border-zinc-800 bg-zinc-900/50"
      )}
    >
      {popularFlag && (
        <div className="absolute top-0 right-0 left-0 bg-gradient-to-r from-violet-600 to-indigo-600 text-white text-xs font-bold py-1.5 text-center">
          MOST POPULAR
        </div>
      )}
      
      <div className="p-6 space-y-4 relative z-10">
        <h3 className="text-xl font-bold text-white flex items-center">
          {title}
          {selected && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="ml-2 bg-violet-500 rounded-full p-0.5 flex items-center justify-center"
            >
              <Check className="h-3 w-3 text-white" />
            </motion.div>
          )}
        </h3>
        
        <div className="flex items-baseline">
          <span className="text-3xl font-bold text-white">${price}</span>
          <span className="text-zinc-400 ml-1">/month</span>
          
          {savings && (
            <motion.div 
              className="ml-3 text-xs font-medium bg-green-500/20 text-green-400 px-2 py-0.5 rounded-full"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              Save ${savings}/yr
            </motion.div>
          )}
        </div>
        
        <ul className="space-y-2 min-h-40">
          {features.map((feature, i) => (
            <motion.li 
              key={i}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 * i }}
              className="flex items-center text-zinc-300"
            >
              <span className="h-5 w-5 rounded-full bg-violet-500/20 text-violet-400 flex items-center justify-center mr-2 text-xs">✓</span> 
              {feature}
            </motion.li>
          ))}
        </ul>
        
        <Button 
          onClick={onSelect}
          variant={selected ? "default" : "outline"}
          className={cn(
            "w-full font-medium transition-all mt-4",
            selected 
              ? "bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 text-white border-0 shadow-lg shadow-violet-900/20" 
              : "border-zinc-700 text-zinc-300 hover:bg-zinc-800"
          )}
        >
          {selected ? (
            <span className="flex items-center">
              <Check className="h-4 w-4 mr-2" /> Selected
            </span>
          ) : "Choose Plan"}
        </Button>
      </div>
      
      {/* 3D Effect Layers */}
      <div className="absolute inset-0 pointer-events-none">
        <motion.div 
          className="absolute inset-0 bg-gradient-to-br from-violet-500/5 to-transparent"
          animate={{ 
            opacity: hovered || selected ? 1 : 0,
          }}
        />
        
        <motion.div 
          className="absolute -right-20 -top-20 w-40 h-40 bg-violet-500/10 rounded-full blur-3xl"
          animate={{ 
            opacity: hovered || selected ? 0.8 : 0,
          }}
        />
        
        <motion.div 
          className="absolute -left-20 -bottom-20 w-40 h-40 bg-indigo-500/10 rounded-full blur-3xl"
          animate={{ 
            opacity: hovered || selected ? 0.8 : 0,
          }}
        />
      </div>
    </motion.div>
  )
}

// Interactive Insurance Option with Visual Feedback
const InsuranceOption = ({ title, description, price, features, selected, onSelect }) => {
  return (
    <motion.div
      whileHover={{ x: 5 }}
      className={cn(
        "group rounded-xl overflow-hidden backdrop-blur-sm border transition-all",
        selected 
? "border-violet-500 bg-gradient-to-r from-zinc-900 to-zinc-950 shadow-lg shadow-violet-900/20" 
          : "border-zinc-800 bg-zinc-900/50"
      )}
    >
      <div className="p-5 flex flex-col h-full">
        <div className="flex justify-between mb-4">
          <div>
            <h3 className="text-base font-medium text-white mb-1">{title}</h3>
            <p className="text-xs text-zinc-400">{description}</p>
          </div>
          
          <div className="flex flex-col items-end">
            <p className="text-lg font-bold text-white">${price}</p>
            <p className="text-xs text-zinc-500">one-time</p>
          </div>
        </div>
        
        <div className="flex-1">
          <ul className="space-y-2 text-sm">
            {features.map((feature, i) => (
              <motion.li 
                key={i}
                initial={{ opacity: 0, x: -5 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.05 * i }}
                className="flex items-start text-zinc-300 gap-2"
              >
                <Check className="h-4 w-4 text-violet-400 mt-0.5 flex-shrink-0" />
                <span>{feature}</span>
              </motion.li>
            ))}
          </ul>
        </div>
        
        <RadioGroup className="mt-4" onValueChange={onSelect}>
          <div className="flex items-center space-x-2">
            <RadioGroupItem 
              value={title} 
              id={`radio-${title}`} 
              checked={selected}
              className={selected ? "text-violet-500 border-violet-500" : ""}
            />
            <Label 
              htmlFor={`radio-${title}`}
              className={cn(
                "cursor-pointer",
                selected ? "text-violet-400" : "text-zinc-400"
              )}
            >
              {selected ? "Selected" : "Select this option"}
            </Label>
          </div>
        </RadioGroup>
      </div>
      
      <motion.div
        className="h-1 w-full bg-gradient-to-r from-violet-500 to-indigo-500"
        initial={{ scaleX: 0 }}
        animate={{ scaleX: selected ? 1 : 0 }}
        transition={{ duration: 0.3 }}
        style={{ transformOrigin: "left" }}
      />
    </motion.div>
  )
}

// Animated Summary Section
const OrderSummary = ({ amount, paymentMethod, subscription, insurance }) => {
  const [expanded, setExpanded] = useState(false)
  
  // Calculate total based on selected options
  const calculateTotal = () => {
    let total = amount
    
    // Add subscription cost if selected
    if (subscription === "monthly") total += 9.99
    if (subscription === "yearly") total += 7.99 * 12
    if (subscription === "lifetime") total += 199.99
    
    // Add insurance cost if selected
    if (insurance === "basic") total += 4.99
    if (insurance === "premium") total += 9.99
    if (insurance === "complete") total += 14.99
    
    return total
  }
  
  const fees = amount * 0.029 + 0.30 // Example transaction fee calculation
  const total = calculateTotal()
  
  return (
    <motion.div 
      className="rounded-xl overflow-hidden bg-zinc-900/70 backdrop-blur-sm border border-zinc-800"
      layout
    >
      <div className="p-5">
        <h3 className="text-base font-bold text-white mb-4 flex items-center">
          <Tag className="h-4 w-4 mr-2 text-violet-400" />
          Order Summary
        </h3>
        
        <div className="space-y-3">
          <div className="flex justify-between text-sm">
            <span className="text-zinc-400">Amount</span>
            <span className="text-white font-medium">${amount.toFixed(2)}</span>
          </div>
          
          <div className="flex justify-between text-sm">
            <span className="text-zinc-400">Transaction Fee</span>
            <span className="text-white font-medium">${fees.toFixed(2)}</span>
          </div>
          
          {subscription && (
            <motion.div 
              className="flex justify-between text-sm"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <span className="text-zinc-400">
                Subscription 
                {subscription === "monthly" && " (Monthly)"}
                {subscription === "yearly" && " (Yearly)"}
                {subscription === "lifetime" && " (Lifetime)"}
              </span>
              <span className="text-white font-medium">
                ${subscription === "monthly" ? "9.99" : 
                   subscription === "yearly" ? (7.99 * 12).toFixed(2) : 
                   subscription === "lifetime" ? "199.99" : "0.00"}
              </span>
            </motion.div>
          )}
          
          {insurance && (
            <motion.div 
              className="flex justify-between text-sm"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <span className="text-zinc-400">
                Insurance 
                {insurance === "basic" && " (Basic)"}
                {insurance === "premium" && " (Premium)"}
                {insurance === "complete" && " (Complete)"}
              </span>
              <span className="text-white font-medium">
                ${insurance === "basic" ? "4.99" : 
                   insurance === "premium" ? "9.99" : 
                   insurance === "complete" ? "14.99" : "0.00"}
              </span>
            </motion.div>
          )}
          
          <div className="border-t border-zinc-800 my-2 pt-2"></div>
          
          <div className="flex justify-between">
            <span className="text-zinc-300 font-medium">Total</span>
            <motion.span 
              className="text-white font-bold"
              key={total}
              initial={{ scale: 1.1, color: "#a78bfa" }}
              animate={{ scale: 1, color: "#ffffff" }}
              transition={{ duration: 0.5 }}
            >
              ${total.toFixed(2)}
            </motion.span>
          </div>
        </div>
        
        <Button 
          className="w-full mt-4 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 text-white font-medium border-0"
          onClick={() => setExpanded(!expanded)}
        >
          <span className="mr-1">View Details</span>
          <motion.div
            animate={{ rotate: expanded ? 180 : 0 }}
            transition={{ duration: 0.3 }}
          >
            <ChevronDown className="h-4 w-4" />
          </motion.div>
        </Button>
      </div>
      
      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="bg-zinc-950/50 text-sm"
          >
            <div className="p-5 space-y-3">
              <div className="text-zinc-400">
                <span className="text-zinc-300 font-medium block mb-1">Payment Method:</span>
                <div className="flex items-center">
                  {paymentMethod === "card" && <CreditCard className="h-4 w-4 mr-2" />}
                  {paymentMethod === "paypal" && <Gift className="h-4 w-4 mr-2" />}
                  {paymentMethod === "apple" && <Shield className="h-4 w-4 mr-2" />}
                  {paymentMethod === "crypto" && <Sparkles className="h-4 w-4 mr-2" />}
                  {paymentMethod === "card" && "Credit Card (Visa, Mastercard, Amex)"}
                  {paymentMethod === "paypal" && "PayPal"}
                  {paymentMethod === "apple" && "Apple Pay"}
                  {paymentMethod === "crypto" && "Cryptocurrency"}
                </div>
              </div>
              
              <div>
                <span className="text-zinc-300 font-medium block mb-1">Payment Details:</span>
                <ul className="space-y-1.5 text-zinc-400">
                  <li className="flex items-center">
                    <Clock className="h-3 w-3 mr-2 text-zinc-500" />
                    Estimated processing time: 1-2 minutes
                  </li>
                  <li className="flex items-center">
                    <TrendingUp className="h-3 w-3 mr-2 text-zinc-500" />
                    Transaction fee: 2.9% + $0.30
                  </li>
                  <li className="flex items-center">
                    <Lock className="h-3 w-3 mr-2 text-zinc-500" />
                    Secure 256-bit SSL encryption
                  </li>
                </ul>
              </div>
              
              <div className="pt-2 mt-2 border-t border-zinc-800 text-zinc-500 text-xs">
                By proceeding with this payment, you agree to our Terms of Service and Privacy Policy.
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

// Checkout Success Animation
const CheckoutSuccess = () => {
  return (
    <motion.div 
      className="bg-zinc-900/70 backdrop-blur-md rounded-xl border border-zinc-800 p-8 text-center relative overflow-hidden"
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ 
        duration: 0.5,
        type: "spring",
        stiffness: 200,
        damping: 20
      }}
    >
      <motion.div
        className="absolute inset-0 bg-gradient-to-br from-green-500/10 to-blue-500/5"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
      />
      
      {/* Success checkmark animation */}
      <motion.div 
        className="w-20 h-20 mx-auto bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center mb-6"
        initial={{ scale: 0 }}
        animate={{ scale: [0, 1.2, 1] }}
        transition={{ delay: 0.2, duration: 0.5 }}
      >
        <Check className="h-10 w-10 text-white" />
      </motion.div>
      
      <motion.h2 
        className="text-2xl font-bold text-white mb-2"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        Payment Successful!
      </motion.h2>
      
      <motion.p 
        className="text-zinc-400 mb-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        Your transaction has been processed successfully.
      </motion.p>
      
      <motion.div
        className="flex flex-col items-center space-y-2 py-4 px-6 bg-zinc-800/50 rounded-lg border border-zinc-700 mb-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
      >
        <p className="text-sm text-zinc-500">Transaction ID</p>
        <p className="text-base font-mono text-white">TX-{Math.random().toString(36).substr(2, 9).toUpperCase()}</p>
      </motion.div>
      
      <motion.div 
        className="flex justify-center space-x-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
      >
        <Button className="bg-zinc-800 text-zinc-300 hover:bg-zinc-700">
          View Receipt
        </Button>
        <Button className="bg-gradient-to-r from-violet-600 to-indigo-600 text-white border-0">
          Continue <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </motion.div>
      
      {/* Animation particles */}
      {[...Array(6)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-2 h-2 rounded-full bg-green-500"
          initial={{ 
            x: 0, 
            y: 0, 
            opacity: 0 
          }}
          animate={{ 
            x: Math.random() * 200 - 100, 
            y: Math.random() * 200 - 100, 
            opacity: [0, 1, 0],
            scale: [0, 1.5, 0]
          }}
          transition={{ 
            delay: 0.8 + (i * 0.1), 
            duration: 1.5, 
            repeat: Infinity,
            repeatDelay: 3
          }}
          style={{
            top: "50%",
            left: "50%",
          }}
        />
      ))}
    </motion.div>
  )
}

export default function PaymentPage() {
  const { theme, setTheme } = useTheme()
  const [amount, setAmount] = useState(100)
  const [paymentMethod, setPaymentMethod] = useState("card")
  const [subscription, setSubscription] = useState(null)
  const [insurance, setInsurance] = useState(null)
  const [showSuccess, setShowSuccess] = useState(false)
  const [activeTab, setActiveTab] = useState("payment")
  
  const handleSubscriptionSelect = (type) => {
    setSubscription(type === subscription ? null : type)
  }
  
  const handleInsuranceSelect = (type) => {
    setInsurance(type === insurance ? null : type)
  }
  
  const handleSubmit = () => {
    // Show loading animation before success
    setShowSuccess(true)
  }
  
  return (
    <div className="min-h-screen bg-zinc-950 text-white">
      <MouseFollower />
      
      <header className="p-4 md:p-6 flex justify-between items-center">
        <div className="flex items-center">
          <Zap className="h-5 w-5 mr-2 text-violet-400" />
          <span className="font-bold">PayUI</span>
        </div>
        <Button 
          variant="ghost" 
          size="icon"
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          className="rounded-full w-8 h-8"
        >
          <Moon className="h-4 w-4 text-zinc-400" />
        </Button>
      </header>
      
      <main className="container mx-auto px-4 py-6 md:py-10 max-w-7xl">
        <motion.h1 
          className="text-3xl md:text-4xl font-bold mb-2"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          Complete Your Payment
        </motion.h1>
        <motion.p 
          className="text-zinc-400 mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          Fast, secure payment processing with end-to-end encryption
        </motion.p>
        
        <AnimatePresence mode="wait">
          {showSuccess ? (
            <motion.div
              key="success"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <CheckoutSuccess />
            </motion.div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 space-y-6">
                <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                  <TabsList className="w-full bg-zinc-900/70 backdrop-blur-sm border border-zinc-800 p-1">
                    <TabsTrigger 
                      value="payment" 
                      className="flex-1 data-[state=active]:bg-violet-600 data-[state=active]:text-white"
                    >
                      Payment
                    </TabsTrigger>
                    <TabsTrigger 
                      value="subscription" 
                      className="flex-1 data-[state=active]:bg-violet-600 data-[state=active]:text-white"
                    >
                      Subscription
                    </TabsTrigger>
                    <TabsTrigger 
                      value="insurance" 
                      className="flex-1 data-[state=active]:bg-violet-600 data-[state=active]:text-white"
                    >
                      Insurance
                    </TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="payment" className="space-y-6 mt-6">
                    <AmountSelector amount={amount} setAmount={setAmount} />
                    <PaymentMethod selected={paymentMethod} onSelect={setPaymentMethod} />
                    <CurrencyConverter amount={amount} />
                  </TabsContent>
                  
                  <TabsContent value="subscription" className="mt-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <SubscriptionCard 
                        title="Monthly" 
                        price={9.99}
                        features={[
                          "Cancel anytime",
                          "Full platform access",
                          "Customer support",
                          "Regular updates"
                        ]}
                        selected={subscription === "monthly"}
                        onSelect={() => handleSubscriptionSelect("monthly")}
                      />
                      
                      <SubscriptionCard 
                        title="Yearly" 
                        price={7.99}
                        features={[
                          "Billed annually",
                          "Save 20% vs monthly",
                          "Full platform access",
                          "Priority customer support",
                          "Regular updates"
                        ]}
                        selected={subscription === "yearly"}
                        onSelect={() => handleSubscriptionSelect("yearly")}
                        popularFlag={true}
                        savings={24}
                      />
                      
                      <SubscriptionCard 
                        title="Lifetime" 
                        price={199.99}
                        features={[
                          "One-time payment",
                          "Lifetime access",
                          "Full platform access",
                          "VIP customer support",
                          "All future updates"
                        ]}
                        selected={subscription === "lifetime"}
                        onSelect={() => handleSubscriptionSelect("lifetime")}
                      />
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="insurance" className="mt-6 space-y-4">
                    <h2 className="text-xl font-bold">Payment Protection</h2>
                    <p className="text-zinc-400 mb-4">Secure your transaction with our protection plans</p>
                    
                    <div className="space-y-4">
                      <InsuranceOption 
                        title="Basic Protection"
                        description="Essential coverage for your purchase"
                        price={4.99}
                        features={[
                          "Covers up to $1,000 in damages",
                          "30-day protection period",
                          "Basic claim support"
                        ]}
                        selected={insurance === "basic"}
                        onSelect={() => handleInsuranceSelect("basic")}
                      />
                      
                      <InsuranceOption 
                        title="Premium Protection"
                        description="Enhanced coverage with extended benefits"
                        price={9.99}
                        features={[
                          "Covers up to $5,000 in damages",
                          "90-day protection period",
                          "Priority claim support",
                          "Fraud monitoring included"
                        ]}
                        selected={insurance === "premium"}
                        onSelect={() => handleInsuranceSelect("premium")}
                      />
                      
                      <InsuranceOption 
                        title="Complete Protection"
                        description="Ultimate coverage for full peace of mind"
                        price={14.99}
                        features={[
                          "Covers up to $10,000 in damages",
                          "180-day protection period",
                          "24/7 VIP claim support",
                          "Fraud monitoring included",
                          "Identity theft protection",
                          "Return shipping coverage"
                        ]}
                        selected={insurance === "complete"}
                        onSelect={() => handleInsuranceSelect("complete")}
                      />
                    </div>
                  </TabsContent>
                </Tabs>
              </div>
              
              <div className="space-y-6">
                <FloatingCard 
                  amount={amount} 
                  paymentMethod={paymentMethod}
                  onFlip={() => {}}
                />
                
                <OrderSummary 
                  amount={amount}
                  paymentMethod={paymentMethod}
                  subscription={subscription}
                  insurance={insurance}
                />
                
                <Button 
                  className="w-full h-14 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 text-white text-lg font-medium shadow-lg shadow-violet-900/20 border-0"
                  onClick={handleSubmit}
                >
                  <motion.div
                    className="flex items-center"
                    whileHover={{ x: 5 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    Complete Payment <ArrowRight className="ml-2 h-5 w-5" />
                  </motion.div>
                </Button>
                
                <div className="text-center text-xs text-zinc-500 flex items-center justify-center mt-4">
                  <Lock className="h-3 w-3 mr-1" /> 
                  Secured with end-to-end encryption
                </div>
              </div>
            </div>
          )}
        </AnimatePresence>
      </main>
      
      <footer className="mt-12 py-8 border-t border-zinc-900 text-center text-zinc-500 text-xs">
        <div className="container mx-auto">
          <p>© 2025 PayUI. All rights reserved. This is a demo interface.</p>
          <p className="mt-2">Powered by React, Framer Motion, and Tailwind CSS.</p>
        </div>
      </footer>
    </div>
  )
}
