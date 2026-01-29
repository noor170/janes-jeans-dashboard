import { useLanguage } from '@/contexts/LanguageContext';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';

const LanguageToggle = () => {
  const { language, setLanguage, t } = useLanguage();

  return (
    <div className="flex items-center gap-2">
      <Label htmlFor="language-toggle" className="text-sm">
        {t('english')}
      </Label>
      <Switch
        id="language-toggle"
        checked={language === 'bn'}
        onCheckedChange={(checked) => setLanguage(checked ? 'bn' : 'en')}
      />
      <Label htmlFor="language-toggle" className="text-sm">
        {t('bengali')}
      </Label>
    </div>
  );
};

export default LanguageToggle;
