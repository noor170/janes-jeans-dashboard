import { useLanguage } from '@/contexts/LanguageContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Languages } from 'lucide-react';

const Settings = () => {
  const { language, setLanguage, t } = useLanguage();

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Languages className="h-5 w-5 text-primary" />
            <CardTitle>{t('languageSettings')}</CardTitle>
          </div>
          <CardDescription>
            Choose your preferred language for the dashboard interface.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between rounded-lg border p-4">
            <div className="space-y-0.5">
              <Label className="text-base">{t('language')}</Label>
              <p className="text-sm text-muted-foreground">
                Switch between English and Bengali (বাংলা)
              </p>
            </div>
            <div className="flex items-center gap-3">
              <span className={language === 'en' ? 'font-medium' : 'text-muted-foreground'}>
                {t('english')}
              </span>
              <Switch
                checked={language === 'bn'}
                onCheckedChange={(checked) => setLanguage(checked ? 'bn' : 'en')}
              />
              <span className={language === 'bn' ? 'font-medium' : 'text-muted-foreground'}>
                {t('bengali')}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>{t('preferences')}</CardTitle>
          <CardDescription>
            Manage your dashboard preferences and settings.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            More settings coming soon...
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default Settings;
