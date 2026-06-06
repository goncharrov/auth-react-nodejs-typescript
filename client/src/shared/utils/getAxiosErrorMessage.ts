export function getAxiosErrorMessage(data: unknown): string {
   if (
      data !== null &&
      typeof data === 'object' &&
      'message' in data &&
      typeof (data as Record<string, unknown>).message === 'string'
   ) {
      return (data as Record<string, unknown>).message as string;
   }
   return '';
}
