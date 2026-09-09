#include "./Variable.h"
#include "./Frame.h"

namespace Storage
{
  class VariablePrimitiveDouble : Variable
  {
  public:
    const static char TypeName = 9;
    VariablePrimitiveDouble(double value);
    VariablePrimitiveDouble(val value);

    const val raw() const;

  private:
    double value;
  };
}