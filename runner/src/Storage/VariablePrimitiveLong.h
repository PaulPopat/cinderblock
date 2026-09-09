#include "./Variable.h"
#include "./Frame.h"

namespace Storage
{
  class VariablePrimitiveLong : Variable
  {
  public:
    const static char TypeName = 8;
    VariablePrimitiveLong(long value);
    VariablePrimitiveLong(val value);

    const val raw() const;

  private:
    long value;
  };
}